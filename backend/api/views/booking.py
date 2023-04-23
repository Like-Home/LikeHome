from api.models.Booking import Booking
from api.serializers import BookingSerializer
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class BookingView(viewsets.ReadOnlyModelViewSet, viewsets.mixins.UpdateModelMixin):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        # filter the bookings by the request.user and order them by check_in date descending
        return Booking.objects.filter(user=self.request.user).order_by('check_in')

    def get_object(self):
        """Get a single booking object by pk

        Returns:
            _type_: _description_
        """
        pk = self.kwargs.get('pk')

        if pk is not None:
            return Booking.objects.get(id=pk, user=self.request.user)

        return super().get_object()

    @action(detail=True, methods=['get'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""

        booking = self.get_object()
        if booking.status == Booking.BookingStatus.CANCELLED:
            return Response({'status': 'booking already cancelled'}, status=status.HTTP_400_BAD_REQUEST)

        # Dont allow cancellation within 24 hours of start date
        if booking.check_in < timezone.now().date() + timezone.timedelta(hours=24):
            return Response({'status': 'booking cannot be cancelled within 24 hours of start date'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = Booking.BookingStatus.CANCELLED
        booking.user.account.travel_points -= booking.points_earned
        booking.save()
        booking.user.account.save()
        return Response({'status': 'booking cancelled'})
