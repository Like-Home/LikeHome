from api.models.hotelbeds.HotelbedsHotel import HotelbedsHotel
from django.contrib.auth.models import User
from django.db import models
from django.db.models import (CharField, DateField, DateTimeField, FloatField,
                              ForeignKey, IntegerField, TextChoices)
from django.utils.timezone import now


class Booking(models.Model):
    # Django enum type
    # https://docs.djangoproject.com/en/4.1/ref/models/fields/
    class BookingStatus(TextChoices):
        PENDING = 'PE', ('Pending')
        CONFIRMED = 'CO', ('Confirmed')
        CANCELLED = 'CA', ('Cancelled')
        PAST = 'PA', ('Past')

    first_name = CharField(max_length=50)
    last_name = CharField(max_length=50)
    email = CharField(max_length=100)
    phone = CharField(max_length=20)
    rate_key = CharField(max_length=400)
    stripe_id = CharField(max_length=200, null=True)
    hotel = ForeignKey(HotelbedsHotel, on_delete=models.CASCADE)
    room_code = CharField(max_length=20, null=True)
    amount_paid = FloatField()
    adults = IntegerField()
    children = IntegerField()
    points_earned = IntegerField()
    travel_points_spent = IntegerField(default=0)
    status = CharField(
        max_length=2, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    user = ForeignKey(User, on_delete=models.CASCADE)
    check_in = DateField()
    check_out = DateField()
    created_at = DateTimeField(default=now, editable=False)

    def _str_(self):
        return self.hotel.name
