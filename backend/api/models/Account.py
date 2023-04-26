from django.contrib.auth.models import User
from django.db import models
from django.db.models import IntegerField, signals


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    travel_points = IntegerField(default=0)
    phone_number = models.CharField(max_length=30, blank=True)
    autofill_booking_info = models.BooleanField(default=False)

    def _str_(self):
        return self.user.username


def auto_create_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance)


signals.post_save.connect(auto_create_account, sender=User)
