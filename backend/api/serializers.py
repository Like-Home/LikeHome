from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.utils.representation import smart_repr

from .models.Booking import Booking


class DateBeforeValidator:
    """
    Validator for checking if a start date is before an end date field.
    Implementation based on `UniqueTogetherValidator` of Django Rest Framework.
    """

    def __init__(self, start_date_field="start_date", end_date_field="end_date", message=None):
        self.start_date_field = start_date_field
        self.end_date_field = end_date_field

    def __call__(self, attrs):
        if attrs[self.start_date_field] > attrs[self.end_date_field]:
            raise serializers.ValidationError(
                {
                    'date': 'IMPOSABLE_DATE_RANGE'
                },
            )

    def __repr__(self):
        return '<%s(start_date_field=%s, end_date_field=%s)>' % (
            self.__class__.__name__,
            smart_repr(self.start_date_field),
            smart_repr(self.end_date_field)
        )


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
