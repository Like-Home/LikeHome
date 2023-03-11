from rest_framework import serializers

from .models.User import User
from .models.Booking import Booking


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
