import django_filters
from api.models.Booking import Booking, BookingCancelException
from api.pagination import BasePagination
from api.serializers import BookingSerializer
from api.utils import format_currency
from app import config
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from templated_email import send_templated_mail


def send_booking_cancelation_email_no_refund(booking: Booking):
    formatted_check_in = booking.check_in.strftime('%a, %b %d')
    email_context = {
        'subject': f'LikeHome booking cancelation - {formatted_check_in} - Itin #{booking.id}',
        'email_title': 'Reservation cancelation',
        'content_title': 'Reservation Cancelation',
        'image': {
            'src': 'https://media.tenor.com/HyKhhSm5VigAAAAC/no-taksies.gif',
            'alt': 'To take backs',
            'subtitle1': 'We hate to see you go...',
            'subtitle2': 'But we\'ll love watching over your deposit!',
        },
        'card': {
            'last_four': booking.card_last_four,
            'network': booking.card_network.lower(),
            'capitalized_network': booking.card_network,
        },
        'thank_you_tag': 'Thank you for your business!',
        'sections': [
            {
                'title': 'Itinerary',
                'line_items': [
                    {
                         'description': 'Booking',
                         'amount': f'#{booking.id}',
                         'href': f'{config.BASE_URL}/booking/{booking.id}',
                    },
                    {
                        'description': 'Hotel',
                        'amount': booking.hotel.name,
                    },
                    {
                        'description': 'Room',
                        'amount': booking.room_name,
                    },
                    *([{
                        'description': 'Cancellation Fee',
                        'amount': '10%',
                        'subitems': [
                            {
                                'description': 'Reason',
                                'amount': 'Overlapping Booking',
                            }
                        ]
                    }] if (booking.overlapping) else []),
                ],
            },
            {
                'title': 'Summary',
                'line_items': [
                    {
                         'description': 'Refund',
                         'amount': 'N/A',
                         'subitems': [
                             {
                                        'description': 'Reason',
                                        'amount': 'Less than 24 hours notice',
                             },
                         ]
                    },
                ],
            }
        ],
        'check_in': booking.check_in.strftime('%Y-%m-%d'),
        'check_out': booking.check_out.strftime('%Y-%m-%d'),
        'contact_us_email': 'bookings@likehome.dev',
        'header_logo_url': 'https://raw.githubusercontent.com/Like-Home/LikeHome/main/frontend/static/favicon.png',
        'rendered_online': True,
        'base_url': config.BASE_URL,
    }

    send_templated_mail(
        recipient_list=[booking.stripe_customer_email],
        to=[f'{booking.stripe_customer_name} <{booking.stripe_customer_email}>'],
        template_name='booking_cancelation',
        from_email='LikeHome <bookings@likehome.dev>',
        context=email_context,
        create_link=True,
    )


def send_booking_cancelation_email_full_refund(booking: Booking):
    formatted_check_in = booking.check_in.strftime('%a, %b %d')
    email_context = {
        'subject': f'LikeHome booking cancelation - {formatted_check_in} - Itin #{booking.id}',
        'email_title': 'Reservation cancelation',
        'content_title': 'Reservation Cancelation',
        'image': {
            'src': 'https://media.tenor.com/SghWCULlKOIAAAAC/refund-you-get-a-refund.gif',
            'alt': 'We can give you a partial refund?',
            'subtitle1': 'Don\'t tell your friends, we were so generous!',
            'subtitle2': 'That was reverse psychology, please tell your friends!',
        },
        'card': {
            'last_four': booking.card_last_four,
            'network': booking.card_network.lower(),
            'capitalized_network': booking.card_network,
        },
        'thank_you_tag': 'Thank you for your business!',
        'sections': [
            {
                'title': 'Itinerary',
                'line_items': [
                    {
                         'description': 'Booking',
                         'amount': f'#{booking.id}',
                         'href': f'{config.BASE_URL}/booking/{booking.id}',
                    },
                    {
                        'description': 'Hotel',
                        'amount': booking.hotel.name,
                    },
                    {
                        'description': 'Room',
                        'amount': booking.room_name,
                    },
                    *([{
                        'description': 'Cancellation Fee',
                        'amount': '10%',
                        'subitems': [
                            {
                                'description': 'Reason',
                                'amount': 'Overlapping Booking',
                            }
                        ]
                    }] if (booking.overlapping) else []),
                ],
            },
            {
                'title': 'Summary',
                'line_items': [
                    {
                        'description': 'Total',
                        'amount': format_currency(booking.amount_paid),
                    },
                    {
                        'description': 'Refund',
                        'amount': format_currency(booking.refund_amount),
                    },
                ],
            }
        ],
        'check_in': booking.check_in.strftime('%Y-%m-%d'),
        'check_out': booking.check_out.strftime('%Y-%m-%d'),
        'contact_us_email': 'bookings@likehome.dev',
        'header_logo_url': 'https://raw.githubusercontent.com/Like-Home/LikeHome/main/frontend/static/favicon.png',
        'rendered_online': True,
        'base_url': config.BASE_URL,
    }

    send_templated_mail(
        recipient_list=[booking.stripe_customer_email],
        to=[f'{booking.stripe_customer_name} <{booking.stripe_customer_email}>'],
        template_name='booking_cancelation',
        from_email='LikeHome <bookings@likehome.dev>',
        context=email_context,
        create_link=True,
    )


def send_booking_cancelation_email_partial_refund(booking: Booking):
    formatted_check_in = booking.check_in.strftime('%a, %b %d')
    email_context = {
        'subject': f'LikeHome booking cancelation - {formatted_check_in} - Itin #{booking.id}',
        'email_title': 'Reservation cancelation',
        'content_title': 'Reservation Cancelation',
        'image': {
            'src': 'https://media1.giphy.com/media/3otPop0YpvMj1Fpl9m/giphy.gif?cid=ecf05e47qchwojd2tnjhjh94o4sf8r5uajbx8p784h9zofxr&ep=v1_gifs_search&rid=giphy.gif&ct=g',
            'alt': 'We can give you a partial refund?',
            'subtitle1': 'We\'ll keep the other 10% as a souvenir.',
            'subtitle2': 'Don\'t worry, we\'ll keep it safe!',
        },
        'card': {
            'last_four': booking.card_last_four,
            'network': booking.card_network.lower(),
            'capitalized_network': booking.card_network,
        },
        'thank_you_tag': 'Thank you for your business!',
        'sections': [
            {
                'title': 'Itinerary',
                'line_items': [
                    {
                         'description': 'Booking',
                         'amount': f'#{booking.id}',
                         'href': f'{config.BASE_URL}/booking/{booking.id}',
                    },
                    {
                        'description': 'Hotel',
                        'amount': booking.hotel.name,
                    },
                    {
                        'description': 'Room',
                        'amount': booking.room_name,
                    },
                    *([{
                        'description': 'Cancellation Fee',
                        'amount': '10%',
                        'subitems': [
                            {
                                'description': 'Reason',
                                'amount': 'Overlapping Booking',
                            }
                        ]
                    }] if (booking.overlapping) else []),
                ],
            },
            {
                'title': 'Summary',
                'line_items': [
                    {
                        'description': 'Total',
                        'amount': format_currency(booking.amount_paid),
                    },
                    {
                        'description': 'Refund',
                        'amount': format_currency(booking.refund_amount),
                        'subitems': [
                            {
                                'description': 'Reason',
                                'amount': '10% overlapping booking fee',
                            },
                        ]
                    },
                ],
            }
        ],
        'check_in': booking.check_in.strftime('%Y-%m-%d'),
        'check_out': booking.check_out.strftime('%Y-%m-%d'),
        'contact_us_email': 'bookings@likehome.dev',
        'header_logo_url': 'https://raw.githubusercontent.com/Like-Home/LikeHome/main/frontend/static/favicon.png',
        'rendered_online': True,
        'base_url': config.BASE_URL,
    }

    send_templated_mail(
        recipient_list=[booking.stripe_customer_email],
        to=[f'{booking.stripe_customer_name} <{booking.stripe_customer_email}>'],
        template_name='booking_cancelation',
        from_email='LikeHome <bookings@likehome.dev>',
        context=email_context,
        create_link=True,
    )


class BookingFilterSet(django_filters.FilterSet):
    status = django_filters.MultipleChoiceFilter(
        choices=Booking.BookingStatus.choices)

    class Meta:
        model = Booking
        fields = ['status']


class BookingView(viewsets.ReadOnlyModelViewSet, viewsets.mixins.UpdateModelMixin):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    filterset_class = BookingFilterSet

    pagination_class = BasePagination

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """

        # filter the bookings by the request.user and order them by check_in date descending
        return Booking.objects.filter(user=self.request.user).order_by('check_in', '-pk').exclude(status=Booking.BookingStatus.PENDING)

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
            send_booking_cancelation_email_no_refund(booking)

            return Response({
                'message': 'Booking canceled but cannot be refunded within 24 hours before check-in.',
                'canceled': True,
                'refund': cancelation_status,
            },
                status=status.HTTP_200_OK
            )
        elif cancelation_status == Booking.BookingCancelationStatus.FULL:
            send_booking_cancelation_email_full_refund(booking)

            return Response({
                'message': 'Booking canceled and fully refunded.',
                'canceled': True,
                'status': cancelation_status,
            },
                status=status.HTTP_200_OK
            )
        elif cancelation_status == Booking.BookingCancelationStatus.PARTIAL:
            send_booking_cancelation_email_partial_refund(booking)

            return Response({
                'message': 'Booking canceled and partially refunded.',
                'canceled': True,
                'refund': cancelation_status,
            },
                status=status.HTTP_200_OK
            )
        else:
            return Response({'message': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
