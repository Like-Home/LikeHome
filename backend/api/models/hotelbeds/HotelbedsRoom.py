from django.db import models

"""{
    "code": "APT.0E",
    "type": "APT",
    "characteristic": "0E",
    "minPax": 1,
    "maxPax": 10,
    "maxAdults": 10,
    "maxChildren": 6,
    "minAdults": 1,
    "description": "APARTMENT basement",
    "typeDescription": {
      "content": "APARTMENT"
    },
    "characteristicDescription": {
      "content": "basement"
    }
  },"""


class HotelbedsRoom(models.Model):
    code = models.CharField(primary_key=True, max_length=10)
    type = models.CharField(max_length=100)
    characteristic = models.CharField(max_length=100)
    minPax = models.IntegerField()
    maxPax = models.IntegerField()
    maxAdults = models.IntegerField()
    maxChildren = models.IntegerField()
    minAdults = models.IntegerField()
    description = models.CharField(max_length=100,  null=True)
    typeDescription = models.CharField(max_length=100, null=True)
    characteristicDescription = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.description
