from django.db import models
from django.db.models import IntegerField, CharField, FloatField, DateTimeField, TextChoices, ForeignKey
from .User import User


class Booking(models.Model):
    # Django enum type
    # https://docs.djangoproject.com/en/4.1/ref/models/fields/
    class BookingStatus(TextChoices):
        PENDING = 'PE', ('Pending')
        CONFIRMED = 'CO', ('Confirmed')
        CANCELLED = 'CA', ('Cancelled')
        PAST = 'PA', ('Past')

    id = IntegerField(primary_key=True)
    stripe_id = CharField(max_length=200)
    amount_paid = FloatField()
    guest_count = IntegerField()
    points_earned = IntegerField()
    status = CharField(max_length=2, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    user_id = ForeignKey(User, on_delete=models.CASCADE)
    start_date = DateTimeField()
    end_date = DateTimeField()
    created_at = DateTimeField()

    def _str_(self):
        return self.title
