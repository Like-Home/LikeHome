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
    simpleCode = models.IntegerField(null=True)
    accommodationType = models.CharField(max_length=255, null=True)
    group = models.ForeignKey(HotelbedsGroupCategory,
                              on_delete=models.CASCADE, null=True)
    description = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.description
