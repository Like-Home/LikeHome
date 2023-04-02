from api.validators import DateBeforeValidator
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


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    # force booking even if there is an overlap
    force = serializers.BooleanField(
        write_only=True,
        default=False
    )

    # TODO: setup permissions
    class Meta:
        fields = '__all__'

        read_only_fields = ('id',
                            'points_earned',
                            'user',
                            'status',
                            'stripe_id',
                            'amount_paid',
                            'created_at')

        model = Booking

        validators = [
            DateBeforeValidator(),
        ]

    def validate(self, attrs):
        """
        APP-21-65: implement a function that takes in a 
        booking and checks whether it is double booked 
        by checking its tart and end time and comparing 
        it with other bookings the user booked. 
        """

        if attrs['force']:
            return super().validate(attrs)

        conflicting_bookings = Booking.objects.filter(
            user=self.context['request'].user,
            start_date__lt=attrs['end_date'],  # checking if start
            end_date__gt=attrs['start_date']
        )

        if conflicting_bookings.exists():
            raise serializers.ValidationError(
                {
                    'date': 'CONFLICTING_BOOKING'
                }
            )

        return super().validate(attrs)

    def create(self,  validated_data):
        amount_paid = 100000
        booking = Booking(
            user=self.context['request'].user,
            hotel_id=validated_data['hotel_id'],
            room_id=validated_data['room_id'],
            guest_count=validated_data['guest_count'],
            start_date=validated_data['start_date'],
            end_date=validated_data['end_date'],
            amount_paid=amount_paid,
            points_earned=amount_paid // 100,
            status=Booking.BookingStatus.PENDING,
            stripe_id='sub_xxxxxxxxxxxxxx',
        )

        booking.save()
        return booking


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


class HotelbedsHotelSerializer(serializers.ModelSerializer):
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
        return sign_url(f'https://maps.googleapis.com/maps/api/staticmap?maptype=roadmap&format=jpg&zoom=13&scale=&size=375x250&markers=icon:https://a.travel-assets.com/shopping-pwa/images/his-preview-marker.png%7C{instance.latitude},{instance.longitude}&key={config.GOOGLE_MAPS_API_KEY}', config.GGOOGLE_MAPS_API_SECERT)

    def get_images(self, instance):
        images = instance.images.all().order_by('order')
        return HotelbedsHotelImageSerializer(images, many=True).data
