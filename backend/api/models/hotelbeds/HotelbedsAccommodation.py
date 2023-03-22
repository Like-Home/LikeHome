from django.db import models

""""code": "P",
    "typeMultiDescription": {
      "content": "Aparthotel"
    },
    "typeDescription": "Aparthotel"""


class HotelbedsAccommodation(models.Model):

    code = models.CharField(primary_key=True, max_length=5)
    typeMultiDescription = models.CharField(max_length=255)
    typeDescription = models.CharField(max_length=255)

    def __str__(self):
        return self.typeDescription
