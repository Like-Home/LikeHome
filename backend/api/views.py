from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, views, viewsets
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from .models.User import User
from .models.Booking import Booking
from .serializers import UserSerializer
from .serializers import BookingSerializer


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class BookingView(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFGeneratorView(views.APIView):
    permissions_classes = [permissions.AllowAny]

    def get(self, request: Request, format=None):
        return Response({'success': True})


class UserView(views.APIView):
    # TODO: figure out why this doesn't work
    permissions_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, format=None):
        user = request.user

        if not user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=401)

        return Response({
            'username': user.username,
            'email': user.email,
        })
