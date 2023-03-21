from django.db import models

"""
{
    "code": "CON",
    "description": {
      "content": "Conferences"
    }
  },"""


class HotelbedsImageType(models.Model):
    code = models.CharField(primary_key=True, max_length=5)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.description
