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
        fields = ('id',
                  'stripe_id',
                  'hotel_id',
                  'room_id',
                  'amount_paid',
                  'guest_count',
                  'points_earned',
                  'status',
                  'user',
                  'start_date',
                  'end_date',
                  'created_at')
        model = Booking
