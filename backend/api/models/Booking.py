
import stripe
from api.models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                                 HotelbedsHotelImage)
from app import config
from django.contrib.auth.models import User
from django.db import models
from django.db.models import (CharField, DateField, DateTimeField, FloatField,
                              ForeignKey, IntegerField, TextChoices)
from django.utils import timezone
from django.utils.timezone import now
from templated_email import send_templated_mail


class BookingCancelException(Exception):
    pass


class Booking(models.Model):
    # Django enum type
    # https://docs.djangoproject.com/en/4.1/ref/models/fields/
    class BookingStatus(TextChoices):
        PENDING = 'PE', ('Pending')
        CONFIRMED = 'CO', ('Confirmed')
        CANCELED = 'CA', ('Canceled')
        REBOOKED = 'RE', ('Rebooked')
        IN_PROGRESS = 'IP', ('In Progress')
        PAST = 'PA', ('Past')

    class BookingCancelationStatus(TextChoices):
        NONE = 'N', ('None')
        FULL = 'F', ('Full')
        PARTIAL = 'P', ('Partial')

    first_name = CharField(max_length=50)
    last_name = CharField(max_length=50)
    email = CharField(max_length=100)
    phone = CharField(max_length=20)
    rate_key = CharField(max_length=400)
    stripe_payment_intent_id = CharField(max_length=200, null=True)
    stripe_refund_id = CharField(max_length=200, null=True, default=None)
    stripe_customer_name = CharField(max_length=200, null=True, default=None)
    stripe_customer_email = CharField(max_length=200, null=True, default=None)
    hotel = ForeignKey(HotelbedsHotel, on_delete=models.CASCADE)
    room_code = CharField(max_length=20, null=True)
    amount_paid = FloatField()  # total

    amount_before_fees_tax_and_discount = FloatField()
    amount_discount = FloatField()
    amount_before_fees_tax = FloatField()
    amount_fees_taxes = FloatField()

    refund_amount = FloatField(default=0)
    adults = IntegerField()
    children = IntegerField()
    rooms = IntegerField(default=1)
    room_name = CharField(max_length=255)
    points_earned = IntegerField()
    points_spent = IntegerField(default=0)
    status = CharField(
        max_length=2, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    cancelation_status = CharField(
        max_length=2, choices=BookingCancelationStatus.choices, null=True, default=None)
    user = ForeignKey(User, on_delete=models.CASCADE)
    check_in = DateField()
    check_out = DateField()
    overlapping = models.BooleanField(default=False)
    rebooked_to = models.OneToOneField(
        'self', on_delete=models.CASCADE, null=True, default=None, related_name='rebooked_from')
    card_last_four = CharField(max_length=4)
    card_network = CharField(max_length=20)
    created_at = DateTimeField(default=now, editable=False)
    canceled_at = DateTimeField(null=True, default=None)

    def cancel(self, full_refund=False, new_status=BookingStatus.CANCELED):
        if self.status == self.BookingStatus.CANCELED:
            raise BookingCancelException('Booking already canceled.')

        if self.status == self.BookingStatus.IN_PROGRESS:
            raise BookingCancelException('Booking is already in progress.')

        if self.status == self.BookingStatus.PAST:
            raise BookingCancelException('Booking has already past.')

        if self.status == self.BookingStatus.PENDING:
            raise BookingCancelException('Booking hasn\'t be paid for yet.')

        self.status = new_status

        if full_refund:
            self.cancelation_status = Booking.BookingCancelationStatus.FULL
            self.refund_amount = self.amount_paid
            refund = stripe.Refund.create(
                payment_intent=self.stripe_payment_intent_id,
                reason='requested_by_customer',
                metadata={
                    'booking_id': self.id
                }
            )
            self.stripe_refund_id = refund['id']
        # don't refund if booking is within 24 hours
        elif self.check_in <= timezone.now().date() + timezone.timedelta(hours=24):
            self.cancelation_status = Booking.BookingCancelationStatus.NONE
        else:
            refund_amount = self.amount_paid
            self.cancelation_status = Booking.BookingCancelationStatus.FULL
            if self.overlapping:
                self.cancelation_status = Booking.BookingCancelationStatus.PARTIAL
                refund_amount = refund_amount * 0.9
            self.refund_amount = refund_amount
            refund_amount = int(refund_amount * 100)

            refund = stripe.Refund.create(
                payment_intent=self.stripe_payment_intent_id,
                amount=refund_amount,
                reason='requested_by_customer',
                metadata={
                    'booking_id': self.id
                }
            )
            self.stripe_refund_id = refund['id']

        self.canceled_at = timezone.now()
        self.user.account.travel_points -= self.points_earned
        self.points_earned = 0

        if self.user.account.travel_points < 0:
            stripe.Customer.create_balance_transaction(
                self.user.account.stripe_customer_id,
                amount=int(self.user.account.travel_points * -1),
                currency="usd",
                description="Adjustment for refunded booking reward point value.",
            )
            invoice = stripe.Invoice.create(
                customer=self.user.account.stripe_customer_id,
                collection_method="send_invoice",
                days_until_due=14,
                auto_advance=True,
                description="Chargeback for refunded booking reward point value.",
            )
            invoice.finalize_invoice()
            invoice.send_invoice()

            email_context = {
                'subject': f'LikeHome not so fast - Itin #{self.id}',
                'email_title': 'Hold up there partner! We\'re not done yet.',
                'content_title': 'Reward Point Chargeback',
                'image': {
                    'src': 'https://media4.giphy.com/media/3o8dp3z1qMdvfOgv28/giphy.gif?cid=ecf05e47gzaueouo6rj108zxqa6zq4k122b721pw2edm61r2&ep=v1_gifs_related&rid=giphy.gif&ct=g',
                    'alt': 'Waiting for our money...',
                    'subtitle1': 'We know you probably didn\'t try to break the point system.',
                    'subtitle2': 'But in case you did, we\'re on to you.',
                },
                'invoice_url': invoice['hosted_invoice_url'],
                'thank_you_tag': 'Thank you for our money back!',
                'contact_us_email': 'bookings@likehome.dev',
                'header_logo_url': 'https://raw.githubusercontent.com/Like-Home/LikeHome/main/frontend/static/favicon.png',
                'rendered_online': True,
                'base_url': config.BASE_URL,
            }

            send_templated_mail(
                recipient_list=[self.stripe_customer_email],
                to=[f'{self.stripe_customer_name} <{self.stripe_customer_email}>'],
                template_name='reward_point_chargeback',
                from_email='LikeHome <bookings@likehome.dev>',
                context=email_context,
                create_link=True,
            )

            self.user.account.travel_points = 0

        self.user.account.save()
        self.save()

        return self.cancelation_status

    def get_image(self):
        image = HotelbedsHotelImage.objects.filter(
            hotel=self.hotel, roomCode=self.room_code
        ).order_by('visualOrder').first()

        return image

    def _str_(self):
        return self.hotel.name
