from django.db import models

from .HotelbedsFacilityGroup import HotelbedsFacilityGroup
from .HotelbedsFacilityTypology import HotelbedsFacilityTypology


class HotelbedsFacility(models.Model):
    code = models.IntegerField(primary_key=True)
    facilityGroup = models.ForeignKey(
        HotelbedsFacilityGroup, on_delete=models.CASCADE)
    facilityTypology = models.ForeignKey(
        HotelbedsFacilityTypology, on_delete=models.CASCADE)
    description = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.description
