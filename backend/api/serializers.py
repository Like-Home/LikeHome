from django.contrib.auth.models import User
from rest_framework import serializers

from .models.Account import Account
from .models.Booking import Booking


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
