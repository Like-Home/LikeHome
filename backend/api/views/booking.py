import stripe
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

        booking: Booking = self.get_object()

        if not booking:
            return Response({'message': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == Booking.BookingStatus.CANCELED:
            return Response({'canceled': False, 'message': 'Booking already canceled.'}, status=status.HTTP_400_BAD_REQUEST)

        if booking.status == Booking.BookingStatus.PAST:
            return Response({'canceled': False, 'message': 'Booking has already past.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = Booking.BookingStatus.CANCELED
        booking.save()

        # don't refund if booking is within 24 hours
        if booking.check_in <= timezone.now().date() + timezone.timedelta(hours=24):
            return Response({
                'message': 'Booking canceled but cannot be refunded within 24 hours before check-in.',
                'canceled': True,
                'refund': False,
            },
                status=status.HTTP_200_OK
            )

        refund_amount = booking.amount_paid
        if booking.overlapping:
            refund_amount = refund_amount * 0.9
        refund_amount = int(refund_amount * 100)

        stripe.Refund.create(
            payment_intent=booking.stripe_id,
            amount=refund_amount,
            reason='requested_by_customer',
            metadata={
                'booking_id': booking.id
            }
        )

        return Response({
            'message': 'Booking canceled.',
            'canceled': True,
            'refund': True,
        },
            status=status.HTTP_200_OK
        )
