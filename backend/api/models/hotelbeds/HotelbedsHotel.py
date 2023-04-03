from django.contrib.auth.models import User
from django.db import models
from django.db.models import IntegerField

from .HotelbedsAccommodation import HotelbedsAccommodation
# from .HotelbedsBoard import HotelbedsBoard
from .HotelbedsCategory import HotelbedsCategory
from .HotelbedsChain import HotelbedsChain
from .HotelbedsFacility import HotelbedsFacility
from .HotelbedsFacilityGroup import HotelbedsFacilityGroup
from .HotelbedsGroupCategory import HotelbedsGroupCategory
from .HotelbedsImageType import HotelbedsImageType
from .HotelbedsRoom import HotelbedsRoom
from .HotelbedsSegment import HotelbedsSegment


class HotelbedsHotel(models.Model):
    code = IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True)
    description = models.CharField(max_length=500)
    countryCode = models.CharField(max_length=3)
    stateCode = models.CharField(max_length=3)
    destinationCode = models.CharField(max_length=5)
    longitude = models.FloatField()
    latitude = models.FloatField()

    category = models.ForeignKey(
        HotelbedsCategory, on_delete=models.CASCADE, null=True)
    categoryGroup = models.ForeignKey(
        HotelbedsGroupCategory, on_delete=models.CASCADE, null=True)
    chain = models.ForeignKey(
        HotelbedsChain, on_delete=models.CASCADE, null=True)
    accommodationType = models.ForeignKey(
        HotelbedsAccommodation, on_delete=models.CASCADE, null=True)
    # boards = models.ManyToManyField(HotelbedsBoard)
    segments = models.ManyToManyField(HotelbedsSegment)

    web = models.CharField(max_length=255, null=True)
    ranking = models.IntegerField()

    address = models.CharField(max_length=255, null=True)
    postalCode = models.CharField(max_length=10, null=True)
    city = models.CharField(max_length=255, null=True)

    def _str_(self):
        return self.name


class HotelbedsHotelImage(models.Model):
    """
     {
      "imageTypeCode": "HAB",
      "path": "00/006474/006474a_hb_ro_014.jpg",
      "roomCode": "DBL.EJ",
      "roomType": "DBL",
      "characteristicCode": "EJ",
      "order": 14,
      "visualOrder": 405
    },"""
    imageType = models.ForeignKey(
        HotelbedsImageType, on_delete=models.CASCADE)
    path = models.CharField(max_length=255)
    roomCode = models.CharField(max_length=255, null=True)
    roomType = models.CharField(max_length=20, null=True)
    characteristicCode = models.CharField(max_length=255, null=True)
    order = models.IntegerField()
    visualOrder = models.IntegerField()
    hotel = models.ForeignKey(
        HotelbedsHotel, on_delete=models.CASCADE, related_name='images')


class HotelbedsHotelRoom(models.Model):
    """
    {
      "roomCode": "ROO.RO-1",
      "isParentRoom": true,
      "minPax": 1,
      "maxPax": 2,
      "maxAdults": 2,
      "maxChildren": 1,
      "minAdults": 1,
      "roomType": "ROO",
      "characteristicCode": "RO-1",
      "roomFacilities": [
        {
          "facilityCode": 220,
          "facilityGroupCode": 60,
          "indLogic": false,
          "number": 0,
          "voucher": false
        },
        {
          "facilityCode": 295,
          "facilityGroupCode": 60,
          "number": 28,
          "indYesOrNo": true,
          "voucher": false
        },
        {
          "facilityCode": 287,
          "facilityGroupCode": 60,
          "indYesOrNo": false,
          "voucher": false
        }
      ],
      "roomStays": [{
        "stayType": "BED",
        "order": "1",
        "description": "Bed room",
        "roomStayFacilities": [{
          "facilityCode": 150,
          "facilityGroupCode": 61,
          "number": 1
        }]
      }],
      "PMSRoomCode": "D2"
    },"""
    roomCode = models.CharField(max_length=255)
    isParentRoom = models.BooleanField()
    minPax = models.IntegerField()
    maxPax = models.IntegerField()
    maxAdults = models.IntegerField()
    maxChildren = models.IntegerField()
    minAdults = models.IntegerField()
    roomType = models.CharField(max_length=20)
    characteristicCode = models.CharField(max_length=255)
    PMSRoomCode = models.CharField(max_length=20, null=True)

    hotel = models.ForeignKey(
        HotelbedsHotel, on_delete=models.CASCADE, related_name='rooms')


class HotelbedsHotelRoomStay(models.Model):
    """{
        "stayType": "BED",
        "order": "1",
        "description": "Bed room",
        "roomStayFacilities": [{
          "facilityCode": 150,
          "facilityGroupCode": 61,
          "number": 1
        }]
      }],"""
    stayType = models.CharField(max_length=10)
    order = models.IntegerField()
    description = models.CharField(max_length=255)
    room = models.ForeignKey(
        HotelbedsHotelRoom, on_delete=models.CASCADE, related_name='roomStays')


class HotelbedsHotelRoomStayFacility(models.Model):
    """
     "facilityCode": 150,
          "facilityGroupCode": 61,
          "number": 1
    """
    facility = models.ForeignKey(
        HotelbedsFacility, on_delete=models.CASCADE)
    facilityGroup = models.ForeignKey(
        HotelbedsFacilityGroup, on_delete=models.CASCADE)
    number = models.IntegerField()
    stay = models.ForeignKey(
        HotelbedsHotelRoomStay, on_delete=models.CASCADE, related_name='roomStayFacilities')


class HotelbedsHotelRoomFacility(models.Model):
    """
    {
          "facilityCode": 220,
          "facilityGroupCode": 60,
          "indLogic": false,
          "indYesOrNo": false,
          "number": 0,
          "voucher": false
        },"""
    facility = models.ForeignKey(
        HotelbedsFacility, on_delete=models.CASCADE)
    facilityGroup = models.ForeignKey(
        HotelbedsFacilityGroup, on_delete=models.CASCADE)
    indLogic = models.BooleanField(null=True)
    indFee = models.BooleanField(null=True)
    indYesOrNo = models.BooleanField(null=True)
    number = models.IntegerField()
    voucher = models.BooleanField()
    room = models.ForeignKey(
        HotelbedsHotelRoom, on_delete=models.CASCADE, related_name='roomFacilities')


class HotelbedsHotelPhone(models.Model):
    """
     {
      "phoneNumber": "+13129224400",
      "phoneType": "PHONEBOOKING"
    },"""
    phoneNumber = models.CharField(max_length=20)
    phoneType = models.CharField(max_length=50)
    hotel = models.ForeignKey(
        HotelbedsHotel, on_delete=models.CASCADE, related_name='phones')


class HotelbedsHotelFacility(models.Model):
    """
      {
      "facilityCode": 20,
      "facilityGroupCode": 10,
      "order": 1,
      "number": 1927,
      "voucher": false
    },"""
    facility = models.ForeignKey(
        HotelbedsFacility, on_delete=models.CASCADE)
    facilityGroup = models.ForeignKey(
        HotelbedsFacilityGroup, on_delete=models.CASCADE)
    order = models.IntegerField()
    number = models.IntegerField()
    voucher = models.BooleanField()
    hotel = models.ForeignKey(
        HotelbedsHotel, on_delete=models.CASCADE, related_name='facilities')


class HotelbedsHotelInterestPoint(models.Model):
    """{
      "facilityCode": 10,
      "facilityGroupCode": 100,
      "order": 1,
      "poiName": "Art Institute of Chicago",
      "distance": "800"
    },"""
    facility = models.ForeignKey(
        HotelbedsFacility, on_delete=models.CASCADE)
    facilityGroup = models.ForeignKey(
        HotelbedsFacilityGroup, on_delete=models.CASCADE)
    order = models.IntegerField()
    poiName = models.CharField(max_length=255, null=True)
    distance = models.IntegerField()
    hotel = models.ForeignKey(
        HotelbedsHotel, on_delete=models.CASCADE, related_name='interestPoints')


class HotelbedsHotelWildcard(models.Model):
    """{
      "roomType": "DBL.EJ-KG",
      "roomCode": "DBL",
      "characteristicCode": "EJ-KG",
      "hotelRoomDescription": {
        "content": "High Floor Superior Room - 1 King Hrng Accs"
      }
    },"""
    roomCode = models.CharField(max_length=20)
    roomType = models.CharField(max_length=20)
    characteristicCode = models.CharField(max_length=20)
    hotelRoomDescription = models.CharField(max_length=255)
    hotel = models.ForeignKey(
        HotelbedsHotel, on_delete=models.CASCADE, related_name='wildcards')
