from django.db import models


class HotelbedsGroupCategory(models.Model):
    """
    {
    "code": "GRUPO2",
    "order": 2,
    "name": {
      "content": "Includes 2-star hotels, standard,  mini hotels, re"
    },
    "description": {
      "content": "Includes 2-star hotels, standard,  mini hotels, residences and rural hotels."
    }
  },"""

    code = models.CharField(primary_key=True, max_length=20)
    order = models.IntegerField()
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.description
