import traceback
from typing import Any

from amadeus import Location, ResponseError
from api.modules.amadeus import amadeus
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, views, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models.Booking import Booking
from .serializers import BookingSerializer, UserSerializer
from api.modules.hotelbeds import hotelbeds
from .models.HotelbedsLocation import HotelbedsLocation
from .models.HotelbedsHotel import HotelbedsHotel


def search_city(req, param):
    if req.method == "GET":
        try:
            return JsonResponse({"locations": HotelbedsLocation.objects.filter(name__icontains=param).values('pk', 'name')})
        except ResponseError as error:
            print(error)
        return JsonResponse({"error": "Invalid request"})


def search_hotel(req, citycode, checkindata, checkoutdata, rooms, travelers):
    if req.method == "GET":
        try:
            hotels = HotelbedsHotel.object.filter(citycode = citycode)
            offers = hotelbeds.post('/hotels', json={
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
                                            "hotels": {
                                            "hotel": [
                                                hotel.pk for hotel in hotels        
                                            ]
                                            }
                                            })
            return JsonResponse({"hotels": offers.json()})
        except ResponseError as error:
            print(error)
        return JsonResponse({"error": "Invalid request"})


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
