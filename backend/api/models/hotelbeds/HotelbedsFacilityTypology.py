from django.db import models


class HotelbedsFacilityTypology(models.Model):
    code = models.IntegerField(primary_key=True)
    numberFlag = models.BooleanField()
    logicFlag = models.BooleanField()
    feeFlag = models.BooleanField()
    distanceFlag = models.BooleanField()
    ageFromFlag = models.BooleanField()
    ageToFlag = models.BooleanField()
    dateFromFlag = models.BooleanField()
    dateToFlag = models.BooleanField()
    timeFromFlag = models.BooleanField()
    timeToFlag = models.BooleanField()
    indYesOrNoFlag = models.BooleanField()
    amountFlag = models.BooleanField()
    currencyFlag = models.BooleanField()
    appTypeFlag = models.BooleanField()
    textFlag = models.BooleanField()

    def __str__(self):
        return self.code
