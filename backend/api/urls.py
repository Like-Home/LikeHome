"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from rest_framework import routers

from .views import CSRFGeneratorView
from .views.booking import BookingView
from .views.checkout import CheckoutView
from .views.destination import DestinationView
from .views.hotel import HotelbedsHotelView
from .views.user import UserView

router = routers.DefaultRouter()
router.register(r'booking', BookingView, 'Booking')
router.register(r'hotel', HotelbedsHotelView, 'Hotel')
router.register(r'user', UserView, 'User')
router.register(r'destination', DestinationView, 'Destination')
router.register(r'checkout', CheckoutView, 'Checkout')

urlpatterns = [
    path('csrf', CSRFGeneratorView.as_view()),
    # path('checkout/', views.create_checkout_session, name='search_city'),
    path('', include(router.urls)),
]
