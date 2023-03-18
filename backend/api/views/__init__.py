from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, views
from rest_framework.request import Request
from rest_framework.response import Response

from .booking import BookingView, create_checkout_session
from .search import search_city, search_hotel
from .user import UserView


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFGeneratorView(views.APIView):
    permissions_classes = [permissions.AllowAny]

    def get(self, request: Request, format=None):
        return Response({'success': True})
