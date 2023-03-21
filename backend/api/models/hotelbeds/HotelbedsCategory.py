from django.db import models

from .HotelbedsGroupCategory import HotelbedsGroupCategory

"""
{
    "code": "BB4",
    "simpleCode": 4,
    "accommodationType": "",
    "group": "GRUPO6",
    "description": {
      "content": "BED AND BREAKFAST 4*"
    }
  },"""


class HotelbedsCategory(models.Model):
    code = models.CharField(primary_key=True, max_length=5)
    simpleCode = models.IntegerField()
    accommodationType = models.CharField(max_length=255)
    group = models.ForeignKey(HotelbedsGroupCategory,
                              on_delete=models.CASCADE)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.description
