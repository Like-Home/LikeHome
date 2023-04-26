import stripe
from api.models.Booking import Booking, BookingCancelException
from api.serializers import BookingSerializer
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

        booking: Booking = self.get_object()

        if not booking:
            return Response({'message': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == Booking.BookingStatus.CANCELED:
            return Response({'canceled': False, 'message': 'Booking already canceled.'}, status=status.HTTP_400_BAD_REQUEST)

        if booking.status == Booking.BookingStatus.PAST:
            return Response({'canceled': False, 'message': 'Booking has already past.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cancelation_status = booking.cancel()
        except BookingCancelException as e:
            return Response({'canceled': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if cancelation_status == Booking.BookingCancelationStatus.NONE:
            return Response({
                'message': 'Booking canceled but cannot be refunded within 24 hours before check-in.',
                'canceled': True,
                'refund': cancelation_status,
            },
                status=status.HTTP_200_OK
            )
        elif cancelation_status == Booking.BookingCancelationStatus.FULL:
            return Response({
                'message': 'Booking canceled and fully refunded.',
                'canceled': True,
                'status': cancelation_status,
            },
                status=status.HTTP_200_OK
            )
        elif cancelation_status == Booking.BookingCancelationStatus.PARTIAL:
            return Response({
                'message': 'Booking canceled and partially refunded.',
                'canceled': True,
                'refund': cancelation_status,
            },
                status=status.HTTP_200_OK
            )
        else:
            return Response({'message': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
