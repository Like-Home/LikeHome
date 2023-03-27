import traceback
from typing import Any

from amadeus import Location, ResponseError
from api.modules.amadeus import amadeus
from api.modules.hotelbeds import hotelbeds
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, serializers, views, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models.Booking import Booking
from .models.hotelbeds.HotelbedsDestinationLocation import \
    HotelbedsDestinationLocation
from .models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                              HotelbedsHotelImage)
from .serializers import BookingSerializer, UserSerializer


def search_city(req, param):
    if req.method == "GET":
        try:
            return JsonResponse({"locations": list(HotelbedsDestinationLocation.objects.filter(name__icontains=param).values('pk', 'name'))})
        except ResponseError as error:
            print(error)
        return JsonResponse({"error": "Invalid request"})


def search_hotel(req, citycode, checkindata, checkoutdata, rooms, travelers):
    """_summary_

    Args:
        req (_type_): _description_
        citycode (_type_): _description_
        checkindata (_type_): _description_
        checkoutdata (_type_): _description_
        rooms (_type_): _description_
        travelers (_type_): _description_

    Filters:
        min_price (_type_): minimum price
        max_price (_type_): maximum price
        accommodation (_type_): accommodation type
        rooms (_type_): Room code
        keywords (_type_): List of Numbers
        boards (_type_):  Board codes
        maxRooms (_type_): maximum number of rooms
        paymentType (_type_): Payment type

    Returns:
        _type_: _description_
    """
    try:
        if req.method == "GET":
            filters = {}

            if 'min_price' in req.GET:
                filters['minRate'] = int(req.GET['min_price'])

            if 'max_price' in req.GET:
                filters['maxRate'] = int(req.GET['max_price'])

            if 'accommodation' in req.GET:
                filters['accommodation'] = req.GET['accommodation'].split(',')

            if 'rooms' in req.GET:
                filters['room'] = {
                    'included': 'true',
                    'room': req.GET['rooms'].split(',')
                }

            if 'keywords' in req.GET:
                filters['keyword'] = {
                    'keyword': req.GET['keywords'].split(',')
                }

            if 'boards' in req.GET:
                filters['board'] = {
                    'included': 'true',
                    'board': req.GET['boards'].split(',')
                }

            if 'maxRooms' in req.GET:
                filters['maxRooms'] = req.GET['maxRooms']

            if 'paymentType' in req.GET:
                filters['paymentType'] = req.GET['paymentType']

            payload = {
                "stay": {
                    "checkIn": checkindata,
                    "checkOut": checkoutdata,
                },
                "occupancies": [
                    {
                        "rooms": rooms,
                        "adults": travelers,
                        "children": 0
                    }
                ],
                "destination": {
                    "code": citycode
                }
            }

            if filters:
                payload['filter'] = filters

            offers = hotelbeds.post('/hotel-api/1.0/hotels', json=payload)

            offers = offers.json()
            print(offers)
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
                    for room in hotel['rooms']:
                        room['images'] = list(HotelbedsHotelImage.objects.filter(
                            hotel=HotelbedsHotel.objects.get(code=hotel['code']), roomCode=room['code']).values('imageType',
                                                                                                                'path',
                                                                                                                'order',
                                                                                                                'visualOrder',))
                    new_offers.append(hotel)
                except HotelbedsHotel.DoesNotExist:
                    print(f"Hotel {hotel['code']} not found in database")
                    continue
            offers['hotels']['hotels'] = new_offers
            return JsonResponse({"offers": offers['hotels']})
    except Exception as e:
        traceback.print_exc()
    return JsonResponse({"message": "An unknown error ocurred"}, status=500)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFGeneratorView(views.APIView):
    permissions_classes = [permissions.AllowAny]

    def get(self, request: Request, format=None):
        return Response({'success': True})


class BookingView(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        return Booking.objects.filter(user=self.request.user)

    def get_object(self):
        """Get a single booking object by pk

        Returns:
            _type_: _description_
        """
        pk = self.kwargs.get('pk')

        if pk is not None:
            return Booking.objects.get(id=pk, user=self.request.user)

        return super().get_object()


class UserView(viewsets.ReadOnlyModelViewSet, viewsets.mixins.UpdateModelMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "me":
            return self.request.user

        # TODO: only allow admins to list all other users
        return super().get_object()

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        user = self.get_object()

        if user != request.user:
            return Response(status=403)

        return super().update(request, *args, **kwargs)
