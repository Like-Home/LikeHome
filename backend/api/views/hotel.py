from api.models.hotelbeds.HotelbedsHotel import HotelbedsHotel
from api.serializers import HotelbedsHotelSerializer
from rest_framework import viewsets


class HotelbedsHotelView(viewsets.mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = HotelbedsHotel.objects.all()
    serializer_class = HotelbedsHotelSerializer
