from rest_framework import serializers
from rest_framework.utils.representation import smart_repr


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


class OfferSearchParams(serializers.Serializer):
    # hotel_id = serializers.IntegerField()
    # TODO: validate future date
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    rooms = serializers.IntegerField(min_value=1)
    adults = serializers.IntegerField(min_value=1)
    children = serializers.IntegerField(min_value=0, default=0)

    default_validators = [DateBeforeValidator('check_in', 'check_out')]


class CharacterSeparatedField(serializers.ListField):
    def __init__(self, *args, **kwargs):
        self.separator = kwargs.pop("separator", ",")
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        if data:
            return super().to_internal_value(data[0].split(self.separator))
        return super().to_internal_value(data)


class OfferFilterParams(serializers.Serializer):
    min_price = serializers.IntegerField(min_value=0, required=False)
    max_price = serializers.IntegerField(min_value=0, required=False)
    accommodation = CharacterSeparatedField(required=False)
    rooms = CharacterSeparatedField(required=False)
    keywords = CharacterSeparatedField(required=False)
    boards = CharacterSeparatedField(required=False)
    max_rooms = serializers.IntegerField(min_value=0, required=False)
    # min_price(_type_): minimum price
    # max_price(_type_): maximum price
    # accommodation(_type_): accommodation type
    # rooms(_type_): Room code
    # keywords(_type_): List of Numbers
    # boards(_type_):  Board codes
    # maxRooms(_type_): maximum number of rooms
    # paymentType(_type_): Payment type

    def validate(self, attrs):
        if attrs.get('min_price') and attrs.get('max_price'):
            if attrs['min_price'] > attrs['max_price']:
                raise serializers.ValidationError(
                    {
                        'min_price': 'IMPOSABLE_PRICE_RANGE'
                    },
                )

        return super().validate(attrs)
