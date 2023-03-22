from django.db import models

""" {
    "code": "007",
    "description": {
      "content": "ROOM007"
    }
  },"""


class HotelbedsChain(models.Model):
    code = models.CharField(primary_key=True, max_length=10)
    description = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.description
