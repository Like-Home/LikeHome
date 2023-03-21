from django.db import models

"""  {
    "code": "BAL",
    "description": {
      "content": "Balearic islands Resident"
    }
  },"""


class HotelbedsClassification(models.Model):
    code = models.CharField(primary_key=True, max_length=10)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.description
