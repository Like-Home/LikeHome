from django.db import models


class HotelbedsFacilityGroup(models.Model):
    code = models.IntegerField(primary_key=True)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.description
