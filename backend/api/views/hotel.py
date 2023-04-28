from api.models.hotelbeds.HotelbedsHotel import HotelbedsHotel
from api.modules.hotelbeds import hotelbeds
from api.modules.hotelbeds.serializers import \
    HotelbedsAPIOfferHotelRoomSerializer
from api.serializers import HotelbedsHotelSerializer
from api.throttles import HotelbedsRateThrottle
from api.validators import DateBeforeValidator
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class OfferSearchParams(serializers.Serializer):
    # hotel_id = serializers.IntegerField()
    # TODO: validate future date
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    rooms = serializers.IntegerField(min_value=1)
    adults = serializers.IntegerField(min_value=1)
    children = serializers.IntegerField(min_value=0, default=0)

    default_validators = [DateBeforeValidator('check_in', 'check_out')]


class HotelbedsHotelView(viewsets.mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = HotelbedsHotel.objects.all()
    serializer_class = HotelbedsHotelSerializer

    def get_throttles(self):
        throttle_classes = []

        if self.action == 'offers':
            throttle_classes = [HotelbedsRateThrottle]

        return [super().get_throttles()] + [throttle() for throttle in throttle_classes]

    @action(detail=True, methods=['get'])
    def offers(self, request, pk=None):
        """Returns a list of offers for a specific hotel id."""

        if pk is None:
            return Response({"detail": "Not found."}, status=400)

        params = OfferSearchParams(data=request.GET)
        params.is_valid(raise_exception=True)
        params = params.data

        payload = {
            "stay": {
                "checkIn": params['check_in'],
                "checkOut": params['check_out'],
            },
            "occupancies": [
                {
                    "rooms": params['rooms'],
                    "adults": params['adults'],
                    "children": params['children'],
                }
            ],
            "hotels": {
                "hotel": [int(pk)]
            },
        }

        offers = hotelbeds.post('/hotel-api/1.0/hotels', json=payload).json()
        hotels = offers['hotels'].get('hotels', [])

        return Response({
            "offers": {
                "rooms": [
                    room for room in HotelbedsAPIOfferHotelRoomSerializer(
                        hotels[0]['rooms'],
                        context={
                            'hotel': self.get_object()
                        },
                        many=True).data if room['details']
                ] if hotels else []
            }
        })
