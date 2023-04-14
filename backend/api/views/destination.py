
import traceback

from api.models.hotelbeds.HotelbedsDestinationLocation import \
    HotelbedsDestinationLocation
from api.models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                                 HotelbedsHotelImage)
from api.modules.hotelbeds import hotelbeds
from api.modules.hotelbeds.serializers import HotelbedsAPIOfferHotelSerializer
from api.validators import OfferFilterParams, OfferSearchParams
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response


def convert_rooms(hotel_id: int, rooms: list):
    """DANGER: This function mutates the rooms list.

    Args:
        hotel_id (int): The hotel id the rooms are from
        rooms (list): List of rooms to be converted.
    """
    hotel = HotelbedsHotel.objects.get(code=hotel_id)
    for room in rooms:
        room['images'] = list(HotelbedsHotelImage.objects.filter(
            hotel=hotel, roomCode=room['code']).values('imageType',
                                                       'path',
                                                       'order',
                                                       'visualOrder',))
        # room['details']


def convert_offers_to_response(offers):
    """ DANGER: This function mutates the offers dict.
    TODO: return more than 10 offers
    """
    offers["hotels"]["hotels"] = offers["hotels"]["hotels"][:10]
    new_offers = []
    for hotel in offers["hotels"]["hotels"]:
        try:
            db_hotel = HotelbedsHotel.objects.get(
                code=hotel['code'])
            hotel['facilities'] = list(
                db_hotel.facilities.values('facility__description', 'facilityGroup__description'))

            hotel['interestPoints'] = list(
                db_hotel.interestPoints.values('poiName'))
            hotel['images'] = list(HotelbedsHotelImage.objects.filter(hotel=db_hotel, imageType='GEN').values('path',
                                                                                                              'order',
                                                                                                              'visualOrder',))
            convert_rooms(hotel['code'], hotel['rooms'])
            new_offers.append(hotel)
        except HotelbedsHotel.DoesNotExist:
            print(f"Hotel {hotel['code']} not found in database")
            continue

    return {
        **offers['hotels'],
        'hotels': new_offers
    }


class LocationOfferSearchParams(OfferSearchParams, OfferFilterParams):
    pass


class DestinationLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelbedsDestinationLocation
        fields = ('code', 'name')


class DestinationLocationParams(serializers.Serializer):
    q = serializers.CharField()


def extract_hotelbeds_offer_filters_from_params(params):
    filters = {}

    if 'min_price' in params:
        filters['minRate'] = params['min_price']

    if 'max_price' in params:
        filters['maxRate'] = params['max_price']

    if 'accommodation' in params:
        filters['accommodation'] = params['accommodation']

    if 'rooms' in params:
        filters['room'] = {
            'included': 'true',
            'room': params['rooms']
        }

    if 'keywords' in params:
        filters['keyword'] = {
            'keyword': params['keywords']
        }

    if 'boards' in params:
        filters['board'] = {
            'included': 'true',
            'board': params['boards']
        }

    if 'max_rooms' in params:
        filters['maxRooms'] = params['max_rooms']

    if filters:
        return {'filters': filters}

    return {}


class DestinationView(viewsets.mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = DestinationLocationSerializer
    queryset = HotelbedsDestinationLocation.objects.all()

    @action(detail=False, methods=['get'])
    def search(self, request: Request):
        """Search for a destination location by name

        Args:
            request (Request): The request object
            param (str): The search param

        Returns:
            _type_: _description_
        """
        params = DestinationLocationParams(data=request.GET)
        params.is_valid(raise_exception=True)
        params = params.data
        try:
            queryset = HotelbedsDestinationLocation.objects.filter(
                name__icontains=params['q'])[:10]
            serializer = DestinationLocationSerializer(
                queryset,
                many=True
            )
            return Response({
                "locations": serializer.data
            })
        except Exception:
            traceback.print_exc()
            return Response({"message": "An unexpected error occurred."}, status=500)

    @action(detail=True, methods=['get'])
    def offers(self, request: Request, pk=None):
        """Returns a list of offers for a specific hotel id.

        Args:
            request (Request): The request object

        Returns:
            _type_: _description_
        """
        params = LocationOfferSearchParams(data=request.GET)
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
            "destination": {
                "code": pk
            },
            **extract_hotelbeds_offer_filters_from_params(params)
        }

        offers = hotelbeds.post('/hotel-api/1.0/hotels', json=payload).json()

        if offers['hotels']['total'] == 0:
            return Response({
                "offers": {
                    "total": 0,
                    "hotels": []
                }
            })

        return Response({
            "offers": {
                **offers['hotels'],
                'hotels': HotelbedsAPIOfferHotelSerializer(
                    offers['hotels']['hotels'],
                    many=True
                ).data
            }
        })
