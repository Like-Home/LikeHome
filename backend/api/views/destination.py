
import re
import traceback
from typing import Any, Dict, List, cast

from api.models.hotelbeds.HotelbedsDestinationLocation import \
    HotelbedsDestinationLocation
from api.models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                                 HotelbedsHotelImage)
from api.modules.hotelbeds import hotelbeds
from api.modules.hotelbeds.serializers import HotelbedsAPIOfferHotelSerializer
from api.pagination import BasePagination
from api.throttles import HotelbedsRateThrottle
from api.validators import OfferFilterParams, OfferSearchParams
from rest_framework import pagination, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response


# Sorting ratings
def convert_category_to_rating_props(category_description):
    numbers = re.findall(r'\d', category_description)
    value = 0

    if numbers:
        value = int(numbers[0])

    if re.search(r'half', category_description, re.IGNORECASE):
        value += 0.5

    return value


class LocationOfferSearchParams(OfferSearchParams, OfferFilterParams):
    sort_by = serializers.ChoiceField(
        choices=['price', 'rating'], required=False)
    sort_order = serializers.ChoiceField(
        choices=['asc', 'desc'], default='desc')


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
    pagination_class = BasePagination

    class Meta:
        ordering = ['-code']

    def get_throttles(self):
        throttle_classes = []

        if self.action == 'offers':
            throttle_classes = [HotelbedsRateThrottle]

        return super().get_throttles() + [throttle() for throttle in throttle_classes]

    @action(detail=False, methods=['get'])
    def search(self, request: Request):
        """Search for a destination location by name."""
        params = DestinationLocationParams(data=request.GET)
        params.is_valid(raise_exception=True)
        params = params.data

        queryset = HotelbedsDestinationLocation.objects.filter(
            name__icontains=params['q']).order_by('-code')
        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['get'])
    def offers(self, request: Request, pk=None):
        """Returns a list of offers for a specific hotel id."""
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

        hotels = offers['hotels'].get('hotels', [])

        if params.get('sort_by') == 'price':
            hotels.sort(
                key=lambda hotel: hotel['minRate'], reverse=params['sort_order'] == 'desc')
        elif params.get('sort_by') == 'rating':
            hotels.sort(
                key=lambda hotel: convert_category_to_rating_props(hotel['categoryName']))
        else:
            # to ensure that the hotels are sorted for the pagination
            hotels.sort(key=lambda hotel: hotel['code'])

        page = self.paginate_queryset(
            hotels  # type: ignore
        )

        return self.paginator.get_paginated_response([
            hotel for hotel in HotelbedsAPIOfferHotelSerializer(
                page,
                many=True
            ).data if hotel['images']
        ], extra_data={'name': HotelbedsDestinationLocation.objects.get(pk=pk).name})
