from django.contrib.auth.models import User
from django.db import models
from django.db.models import (CharField, DateTimeField, FloatField, ForeignKey,
                              IntegerField, TextChoices)
from django.utils.timezone import now


class Booking(models.Model):
    # Django enum type
    # https://docs.djangoproject.com/en/4.1/ref/models/fields/
    class BookingStatus(TextChoices):
        PENDING = 'PE', ('Pending')
        CONFIRMED = 'CO', ('Confirmed')
        CANCELLED = 'CA', ('Cancelled')
        PAST = 'PA', ('Past')

    stripe_id = CharField(max_length=200)
    hotel_id = CharField(max_length=200, null=True)
    room_id = CharField(max_length=20, null=True)
    amount_paid = FloatField()
    guest_count = IntegerField()
    points_earned = IntegerField()
    status = CharField(
        max_length=2, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    user = ForeignKey(User, on_delete=models.CASCADE)
    start_date = DateTimeField()
    end_date = DateTimeField()
    created_at = DateTimeField(default=now, editable=False)

    def _str_(self):
        return self.hotel_id
