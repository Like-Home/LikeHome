from django.contrib.auth.models import User
from rest_framework import serializers

from .models.Booking import Booking


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'username', 'email', 'first_name',
                  'last_name', 'date_joined', 'last_login')
        model = User


class BookingSerializer(serializers.ModelSerializer):
    # TODO: setup permissions
    class Meta:
        fields = '__all__'

        read_only_fields = ('id', 'points_earned', 'user',
                            'status', 'stripe_id', 'amount_paid', 'created_at')

        model = Booking

    def create(self, validated_data):
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
