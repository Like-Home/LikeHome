from api.models.hotelbeds.HotelbedsFacilityTypology import \
    HotelbedsFacilityTypology
from api.models.hotelbeds.HotelbedsHotel import (HotelbedsFacility,
                                                 HotelbedsFacilityGroup,
                                                 HotelbedsHotelFacility,
                                                 HotelbedsHotelImage,
                                                 HotelbedsHotelInterestPoint,
                                                 HotelbedsHotelRoom,
                                                 HotelbedsHotelRoomFacility)
from rest_framework import serializers


class HotelbedsHotelRoomFacilityGetters(serializers.ModelSerializer):
    facility = serializers.CharField(source='facility.description')
    facilityGroup = serializers.CharField(source='facilityGroup.description')


class HotelbedsHotelInterestPointSerializer(HotelbedsHotelRoomFacilityGetters, serializers.ModelSerializer):
    class Meta:
        model = HotelbedsHotelInterestPoint
        fields = '__all__'


class HotelbedsFacilityTypologySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsFacilityTypology


class HotelbedsFacilitySerializer(serializers.ModelSerializer):
    facilityTypology = HotelbedsFacilityTypologySerializer()

    class Meta:
        fields = '__all__'
        model = HotelbedsFacility


class HotelbedsFacilityGroupSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsFacilityGroup


class HotelbedsHotelRoomSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsHotelRoom


class HotelbedsHotelFacilitySerializer(serializers.ModelSerializer):
    facility = HotelbedsFacilitySerializer()
    facilityGroup = HotelbedsFacilityGroupSerializer()

    class Meta:
        fields = '__all__'
        model = HotelbedsHotelFacility


class HotelbedsHotelRoomFacilitySerializer(serializers.ModelSerializer):
    facility = HotelbedsFacilitySerializer()
    facilityGroup = HotelbedsFacilityGroupSerializer()

    class Meta:
        model = HotelbedsHotelRoomFacility
        fields = ('facility', 'facilityGroup',
                  'indLogic',
                  'indFee',
                  'indYesOrNo',
                  'number',
                  'voucher',
                  )


class HotelbedsHotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelbedsHotelImage
        fields = ('path',)


class HotelbedsAPIOfferHotelRoomSerializer(serializers.Serializer):
    code = serializers.CharField()
    name = serializers.CharField()
    rates = serializers.ListField()
    images = serializers.SerializerMethodField()
    facilities = serializers.SerializerMethodField()
    details = serializers.SerializerMethodField()

    def get_images(self, obj):
        images = HotelbedsHotelImage.objects.filter(
            hotel=self.context['hotel'], roomCode=obj['code']).order_by('visualOrder')
        return HotelbedsHotelImageSerializer(images, many=True).data

    def get_facilities(self, obj):
        try:
            room = HotelbedsHotelRoom.objects.get(
                roomCode=obj['code'], hotel=self.context['hotel'])
            facilities = HotelbedsHotelRoomFacility.objects.filter(
                room=room).order_by('facilityGroup', 'facility')
            return HotelbedsHotelRoomFacilitySerializer(facilities, many=True).data
        except HotelbedsHotelRoom.DoesNotExist:
            return None

    def get_details(self, obj):
        try:
            room = HotelbedsHotelRoom.objects.get(
                roomCode=obj['code'], hotel=self.context['hotel'])
            return HotelbedsHotelRoomSerializer(room).data
        except HotelbedsHotelRoom.DoesNotExist:
            return None


class HotelbedsAPIOfferHotelSerializer(serializers.Serializer):
    code = serializers.IntegerField()
    name = serializers.CharField()
    categoryName = serializers.CharField()
    zoneName = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    minRate = serializers.FloatField()
    maxRate = serializers.FloatField()
    currency = serializers.CharField()
    facilities = serializers.SerializerMethodField()

    # interest_points = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    def get_facilities(self, obj):
        queryset = HotelbedsHotelFacility.objects.filter(
            hotel=obj['code']).order_by('facilityGroup', 'facility')
        return HotelbedsHotelFacilitySerializer(queryset, many=True).data

    # def get_interest_points(self, obj):
    #     interest_points = HotelbedsHotelInterestPoint.objects.filter(
    #         hotel_id=obj['code']
    #     )
    #     return HotelbedsHotelInterestPointSerializer(interest_points, many=True).data

    def get_images(self, obj):
        images = HotelbedsHotelImage.objects.filter(
            hotel_id=obj['code'],
            imageType='GEN'
        ).order_by('visualOrder')
        return HotelbedsHotelImageSerializer(images, many=True).data
