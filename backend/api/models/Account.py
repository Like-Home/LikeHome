from django.contrib.auth.models import User
from django.db import models
from django.db.models import IntegerField


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    travel_points = IntegerField()

    def _str_(self):
        return self.user.username
