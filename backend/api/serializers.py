from typing import Any

from app import config
from django.contrib.auth.models import User
from rest_framework import serializers

from .models.Booking import Booking
from .models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                              HotelbedsHotelFacility,
                                              HotelbedsHotelImage,
                                              HotelbedsHotelInterestPoint,
                                              HotelbedsHotelPhone,
                                              HotelbedsHotelRoom,
                                              HotelbedsHotelWildcard)
from .modules.google import sign_url


class UserSerializer(serializers.ModelSerializer):
    travel_points = serializers.IntegerField(
        read_only=True, source='account.travel_points')
    autofill_booking_info = serializers.BooleanField(
        source='account.autofill_booking_info')
    phone_number = serializers.CharField(
        source='account.phone_number', allow_blank=True)

    image = serializers.SerializerMethodField()

    def update(self, instance: Any, validated_data: Any) -> Any:
        account = instance.account
        validated_account_data = validated_data.pop('account', {})
        account.autofill_booking_info = validated_account_data.pop(
            'autofill_booking_info', account.autofill_booking_info)
        account.phone_number = validated_account_data.pop(
            'phone_number', account.phone_number)
        account.save()

        return super().update(instance, validated_data)

    def get_image(self, instance):
        return instance.socialaccount_set.first().get_avatar_url()

    class Meta:
        exclude = ('password',)
        read_only_fields = ('id',
                            'travel_points',
                            'username',
                            'last_login',
                            'date_joined',
                            'groups',
                            'date_joined',
                            'is_staff',
                            'is_superuser',
                            'user_permissions',
                            'is_active'
                            )

        model = User


class HotelbedsHotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        exclude = ['hotel']
        model = HotelbedsHotelImage


class HotelbedsHotelWildcardSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsHotelWildcard


class HotelbedsHotelPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsHotelPhone


class HotelbedsHotelInterestPointSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsHotelInterestPoint


class HotelbedsHotelFacilitySerializer(serializers.ModelSerializer):
    class Meta:
        exclude = ['hotel']
        model = HotelbedsHotelFacility
        depth = 1


class HotelbedsHotelRoomSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = HotelbedsHotelRoom


class HotelbedsHotelSerializerSimple(serializers.ModelSerializer):
    phones = HotelbedsHotelPhoneSerializer(many=True)

    class Meta:
        fields = '__all__'
        model = HotelbedsHotel


class HotelbedsHotelSerializer(HotelbedsHotelSerializerSimple):
    images = serializers.SerializerMethodField()
    google_map_url = serializers.SerializerMethodField()
    wildcards = HotelbedsHotelWildcardSerializer(many=True)
    phones = HotelbedsHotelPhoneSerializer(many=True)
    interestPoints = HotelbedsHotelInterestPointSerializer(many=True)
    facilities = HotelbedsHotelFacilitySerializer(many=True)
    rooms = HotelbedsHotelRoomSerializer(many=True)

    class Meta:
        fields = '__all__'
        model = HotelbedsHotel
        depth = 3

    def get_google_map_url(self, instance: HotelbedsHotel):
        if config.MONEY_SAVER_MODE:
            return '/images/placeholders/staticmap.jpeg'
        return sign_url(f'https://maps.googleapis.com/maps/api/staticmap?maptype=roadmap&format=jpg&zoom=13&scale=&size=375x250&markers=icon:https://a.travel-assets.com/shopping-pwa/images/his-preview-marker.png%7C{instance.latitude},{instance.longitude}&key={config.GOOGLE_MAPS_API_KEY}', config.GOOGLE_MAPS_API_SECERT)

    def get_images(self, instance):
        images = instance.images.all().order_by('order')
        return HotelbedsHotelImageSerializer(images, many=True).data


class BookingSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    hotel = HotelbedsHotelSerializerSimple(read_only=True)
    email = serializers.EmailField()
    rebooked_from = serializers.IntegerField(
        read_only=True, allow_null=True, source='rebooked_from.id')
    # room = serializers.SerializerMethodField()

    class Meta:
        fields = '__all__'
        read_only_fields = (
            'image',
            'refund_amount',
            'rooms',
            'room_name',
            'cancelation_status',
            'rebooked_to',
            'rebooked_from',
            'hotel',
            'rate_key',
            'stripe_payment_intent_id',
            'hotel',
            'room_code',
            'amount_paid',
            'adults',
            'children',
            'points_earned',
            'status',
            'user',
            'check_in',
            'check_out',
            'created_at',
            'canceled_at',
        )
        model = Booking

    # def get_room(self, instance):
    #     room = HotelbedsHotelRoom.objects.filter(
    #         hotel=instance.hotel, roomCode=instance.room_code
    #     ).first()

    #     return HotelbedsHotelRoomSerializer(room).data

    def get_image(self, instance):
        image = instance.get_image()

        if image:
            return image.path

        return None
