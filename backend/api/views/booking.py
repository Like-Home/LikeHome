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
        return Booking.objects.filter(user=self.request.user).order_by('check_in').exclude(status=Booking.BookingStatus.PENDING)

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
            return Response({'canceled': False, 'message': 'Booking already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        if booking.status == Booking.BookingStatus.PAST:
            return Response({'canceled': False, 'message': 'Booking has already past.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = Booking.BookingStatus.CANCELLED
        booking.save()

        # don't refund if booking is within 24 hours
        if booking.check_in < timezone.now().date() + timezone.timedelta(hours=24):
            return Response({
                'canceled': True,
                'refund': False,
            },
                status=status.HTTP_200_OK
            )
        booking.save()

        # TODO: refund the booking
        #       if booking.overlapping is True then withhold 10% of the refund

        return Response({'status': 'booking cancelled'})
