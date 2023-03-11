from django.db import models
from django.db.models import IntegerField, CharField, DateTimeField


class User(models.Model):
    id = IntegerField(primary_key=True)
    email = CharField(max_length=200)
    travel_points = IntegerField()
    username = CharField(max_length=60)
    password = CharField(max_length=200)
    created_at = DateTimeField()

    def _str_(self):
        return self.title
