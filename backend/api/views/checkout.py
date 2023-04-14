
import base64
import traceback

import stripe
from api.models.Booking import Booking
from api.models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                                 HotelbedsHotelImage)
from api.modules.hotelbeds import hotelbeds
from app.config import STRIPE_ENDPOINT_SECRET
from django.utils.dateparse import parse_date
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response


class CheckoutSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    rate_key = serializers.CharField()

    # force booking even if there is an overlap
    force = serializers.BooleanField(default=False, write_only=True)

    # apply travel points to booking
    apply_point_balance = serializers.BooleanField(
        default=False, write_only=True)


def stripe_create_checkout(
        booking_id,
        hotel_name, room_number, check_in, check_out, hotel_price, hotel_image):
    domain_url = 'http://localhost:8080'

    extra_product_data = {}
    if hotel_image:
        extra_product_data['images'] = [hotel_image]

    return stripe.checkout.Session.create(
        success_url=f"{domain_url}/booking/{booking_id}/?stripe=success",
        cancel_url=f"{domain_url}/checkout/?stripe=cancelled",
        payment_method_types=['card'],
        mode='payment',
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "tax_behavior": "exclusive",
                    "unit_amount": hotel_price,
                    "product_data": {
                        "name": hotel_name,
                        "description": f"{room_number} from {check_in} to {check_out}",
                        **extra_product_data
                    },
                },
                "quantity": 1,
            }
        ],
        metadata={
            "booking_id": booking_id,
        }
    )


class CheckoutView(viewsets.mixins.CreateModelMixin, viewsets.GenericViewSet):
    def get_serializer_class(self):
        if self.action == 'create':
            return CheckoutSerializer
        return serializers.Serializer

    def retrieve(self, request: Request, pk=None):
        """Returns a list of offers for a specific hotel id.

        Args:
            request (Request): The request object

        Returns:
            _type_: _description_
        """
        if pk is None:
            return Response({"message": "Missing rateKey."}, status=400)

        rate_key = base64.b64decode(pk).decode('utf-8')

        payload = {
            "rooms": [
                {
                    "rateKey": rate_key,
                }
            ]
        }

        response = hotelbeds.post(
            '/hotel-api/1.0/checkrates', json=payload).json()

        return Response({
            "hotel": response['hotel']
        })

    @staticmethod
    def deduct_travel_points(net_cost: float, reward_points: int):
        """Does the math to deduct travel points from the cost of a booking.

        Args:
            net_cost (float): The net cost of the booking.
            reward_points (int): The users reward point balance.

        Returns:
            Tuple[float, int, int]: (
                The net cost after travel points have been deducted,
                The number of travel points used,
                The remaining travel points
            )
        """
        discount = reward_points / 100
        net_cost_after_discount = net_cost - discount

        if net_cost_after_discount < 0:
            points_used = int(net_cost * 100)
            reward_points_remaining = reward_points - points_used
            return (0, points_used, reward_points_remaining)
        else:
            return (net_cost_after_discount, reward_points, 0)

    def create(self, request: Request):
        """Returns a list of offers for a specific hotel id.

        Args:
            request (Request): The request object

        Returns:
            _type_: _description_
        """
        params = CheckoutSerializer(data=request.data)
        params.is_valid(raise_exception=True)
        params = params.validated_data

        rate_key = base64.b64decode(params['rate_key']).decode('utf-8')

        payload = {
            "rooms": [
                {
                    "rateKey": rate_key,
                }
            ]
        }

        response = hotelbeds.post(
            '/hotel-api/1.0/checkrates', json=payload).json()

        hotel = HotelbedsHotel.objects.get(code=response['hotel']['code'])

        check_in_date = parse_date(response['hotel']['checkIn'])
        check_out_date = parse_date(response['hotel']['checkOut'])

        if not params['force']:
            conflicting_bookings = Booking.objects.filter(
                user=request.user,
                check_in__lt=check_out_date,
                check_out__gt=check_in_date
            )

            if conflicting_bookings.exists():
                raise serializers.ValidationError(
                    {
                        'date': 'CONFLICTING_BOOKING'
                    }
                )

        total_net_float = float(response['hotel']['totalNet'])
        points_used = 0
        if params['apply_point_balance']:
            (total_net_float, points_used, points_remaining) = self.deduct_travel_points(
                total_net_float,
                request.user.travel_points
            )

            request.user.travel_points = points_remaining
            request.user.save()

        booking = Booking(
            first_name=params['first_name'],
            last_name=params['last_name'],
            email=params['email'],
            phone=params['phone'],
            rate_key=params['rate_key'],
            user=request.user,
            hotel=hotel,
            room_code=response['hotel']['rooms'][0]['code'],
            adults=response['hotel']['rooms'][0]['rates'][0]['adults'],
            children=response['hotel']['rooms'][0]['rates'][0]['children'],
            check_in=check_in_date,
            check_out=check_out_date,
            amount_paid=total_net_float,
            points_earned=int(total_net_float),
            points_spent=points_used,
            status=Booking.BookingStatus.PENDING,
            stripe_id=None,
        )

        booking.save()

        hotel_image = HotelbedsHotelImage.objects.filter(
            hotel=hotel, roomCode=response['hotel']['rooms'][0]['code']
        ).order_by('visualOrder').first()

        try:
            # TODO: indicate the discount in the stripe checkout
            #       we might need to create a custom checkout page with elements
            checkout_session = stripe_create_checkout(
                booking.id,
                response['hotel']['name'],
                response['hotel']['rooms'][0]['name'],
                response['hotel']['checkIn'],
                response['hotel']['checkOut'],
                int(total_net_float * 100),
                f"http://photos.hotelbeds.com/giata/medium/{hotel_image.path}" if hotel_image else None
            )
            return Response({
                'id': checkout_session['id'],
                'url': checkout_session['url']
            })
        except Exception as e:
            traceback.print_exc()
            return Response({'message': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def webhook(self, request: Request):
        payload = request.body

        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        if not sig_header:
            return Response({
                'message': 'Missing Stripe signature header.'
            }, status=400)

        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_ENDPOINT_SECRET
            )
        except ValueError as e:
            # Invalid payload
            return Response({
                'message': 'Invalid payload.'
            }, status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return Response({
                'message': 'Invalid signature.'
            }, status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            metadata = session['metadata']

            booking = Booking.objects.get(id=metadata['booking_id'])

            if booking.status != Booking.BookingStatus.PENDING:
                return Response({
                    'message': 'Booking has already been processed.'
                }, status=400)

            booking.stripe_id = session['id']
            booking.status = Booking.BookingStatus.CONFIRMED

            booking.user.account.apply_points += booking.points_earned
            booking.user.account.save()

            booking.save()

        return Response(status=200)


if __name__ == '__main__':
    (net_cost, points_used, points_remaining) = CheckoutView.deduct_travel_points(100, 1000)

    assert net_cost == 90
    assert points_used == 1000
    assert points_remaining == 0

    (net_cost, points_used, points_remaining) = CheckoutView.deduct_travel_points(100, 100)

    assert net_cost == 99
    assert points_used == 100
    assert points_remaining == 0

    (net_cost, points_used, points_remaining) = CheckoutView.deduct_travel_points(100, 10000)

    assert net_cost == 0
    assert points_used == 10000
    assert points_remaining == 0

    (net_cost, points_used, points_remaining) = CheckoutView.deduct_travel_points(100, 10001)

    assert net_cost == 0
    assert points_used == 10000
    assert points_remaining == 1
