
import base64
import traceback

import stripe
from api.models.Booking import Booking, BookingCancelException
from api.models.hotelbeds.HotelbedsHotel import (HotelbedsHotel,
                                                 HotelbedsHotelImage)
from api.modules.hotelbeds import hotelbeds
from app import config
from django.utils.dateparse import parse_date
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from ..serializers import HotelbedsHotelSerializer


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

    rebooking_id = serializers.IntegerField(required=False)


def book_on_hotelbeds(request, rate_key, checkrate, params):
    rate = checkrate['hotel']['rooms'][0]['rates'][0]
    paxes = []
    for room in range(1, rate['rooms'] + 1):
        paxes.append({
            "roomId": room,
            "type": "AD",
            "name": params['first_name'],
            "surname": params['last_name'],
        })

    for _ in range(rate['adults'] - rate['rooms']):
        paxes.append({
            "roomId": 1,
            "type": "AD",
            "name": params['first_name'],
            "surname": params['last_name'],
        })

    for _ in range(rate['children']):
        paxes.append({
            "roomId": 1,
            "type": "CH",
            "name": params['first_name'],
            "surname": params['last_name'],
        })

    payload = {
        "holder": {
            "name": params['first_name'],
            "surname": params['last_name'],
        },
        "rooms": [{
            "rateKey": rate_key,
            'paxes': paxes
        }],
        "voucher": {
            "email": {
                "to": params['email'],
                "body": "Voucher body is to be written here."
            }
        },
        "clientReference": f"likehome-{request.user.id}",
        "creationUser": "likehome",
        "tolerance": 50,
        "remark": "Booking remarks are to be written here."
    }

    # random 500 errors
    response2 = hotelbeds.post('/hotel-api/1.2/bookings', json=payload)

    if response2.status_code == 500:
        body = response2.json()
        if body['error']['message'].startswith('Price has changed'):
            raise serializers.ValidationError(
                {
                    'price': 'PRICE_CHANGED'
                }
            )
        else:
            print('error', body)
            raise serializers.ValidationError(
                {
                    'price': 'UNKNOWN_ERROR'
                }
            )

    # print(response2)
    # print(response2.json())
    return response2.json()


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

        total_price = float(response['hotel']['totalNet'])

        price = {
            'beforeTax': round(total_price / 1.1, 2),
            'afterTax': round(total_price, 2),
            'tax': round(total_price * 0.1, 2),
        }

        return Response({
            'hotel': response['hotel'],
            'price': price,
            'extended': HotelbedsHotelSerializer(HotelbedsHotel.objects.get(code=response['hotel']['code'])).data,
            **self.create_rewards_object(request, price),
        })

    @staticmethod
    def create_rewards_object(request: Request, price: dict):
        travel_points = request.user.account.travel_points

        if travel_points > 0:
            (net_cost_after_discount, reward_points, reward_points_remaining) = CheckoutView.deduct_travel_points(
                price['beforeTax'],
                travel_points
            )

            return {
                'rewards': {
                    'points': reward_points,
                    'discount': round(price['beforeTax'] - net_cost_after_discount, 2),
                    'original': price,
                    'discounted': {
                        'beforeTax': round(net_cost_after_discount, 2),
                        'afterTax': round(net_cost_after_discount * 1.1, 2),
                        'tax': round(net_cost_after_discount * 0.1, 2),
                    },
                    'free': reward_points_remaining > 0,
                },
            }

        return {}

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

        rebooking_id = params.get('rebooking_id')
        previous_booking = None

        if rebooking_id is not None:
            previous_booking = Booking.objects.get(
                id=rebooking_id, user=request.user, status=Booking.BookingStatus.CONFIRMED)
            try:
                previous_booking.cancel(
                    full_refund=True,
                    new_status=Booking.BookingStatus.REBOOKED,
                )
            except BookingCancelException as e:
                return Response({'canceled': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

        conflicting_booking_found = Booking.objects.filter(
            user=request.user,
            status=Booking.BookingStatus.CONFIRMED,
            check_in__lt=check_out_date,
            check_out__gt=check_in_date
        )
        if previous_booking:
            conflicting_booking_found = conflicting_booking_found.exclude(
                id=previous_booking.id
            )

        conflicting_booking_found = conflicting_booking_found.exists()

        print('conflicting_booking_found', conflicting_booking_found)

        if not params['force'] and conflicting_booking_found:
            raise serializers.ValidationError(
                {
                    'date': 'CONFLICTING_BOOKING'
                }
            )

        total_net_float_before_tax = float(response['hotel']['totalNet']) / 1.1
        points_used = 0
        points_remaining = request.user.account.travel_points
        if params['apply_point_balance']:
            (total_net_float_before_tax, points_used, points_remaining) = self.deduct_travel_points(
                total_net_float_before_tax,
                request.user.account.travel_points
            )

        # TODO: figure out random 500 errors before enabling this
        # book_on_hotelbeds(request, rate_key, response, params)

        total_net_float = total_net_float_before_tax * 1.1
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
            rooms=response['hotel']['rooms'][0]['rates'][0]['rooms'],
            room_name=response['hotel']['rooms'][0]['name'],
            check_in=check_in_date,
            check_out=check_out_date,
            amount_paid=total_net_float,
            # START: finalized in webhook
            status=Booking.BookingStatus.PENDING,
            points_earned=0,
            points_spent=0,
            rebooked_from=None,
            rebooked_to=None,
            stripe_payment_intent_id=None,
            # END: finalized in webhook
            overlapping=conflicting_booking_found,
        )

        booking.save()

        hotel_image = HotelbedsHotelImage.objects.filter(
            hotel=hotel, roomCode=response['hotel']['rooms'][0]['code']
        ).order_by('visualOrder').first()

        extra_product_data = {}
        if hotel_image:
            extra_product_data['images'] = [
                f"https://photos.hotelbeds.com/giata/medium/{hotel_image.path}"
            ]

        referrer = request.META.get('HTTP_REFERER')

        try:
            # TODO: indicate the discount in the stripe checkout
            #       we might need to create a custom checkout page with elements
            checkout_session = stripe.checkout.Session.create(
                success_url=f"{config.BASE_URL}/booking/{booking.id}/?stripe=success",
                cancel_url=f"{referrer}?stripe=canceled",
                payment_method_types=['card'],
                mode='payment',
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "tax_behavior": "exclusive",
                            "unit_amount": int(total_net_float * 100),
                            "product_data": {
                                "name": response['hotel']['name'],
                                "description": f"{response['hotel']['rooms'][0]['name']} from {response['hotel']['checkIn']} to {response['hotel']['checkOut']}",
                                **extra_product_data
                            },
                        },
                        "quantity": 1,
                    }
                ],
                metadata={
                    "booking_id": booking.id,
                    "points_earned": int(total_net_float),
                    "points_spent": points_used,
                    "rebooked_from": previous_booking.id if previous_booking else None,
                }
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
                payload, sig_header, config.STRIPE_ENDPOINT_SECRET
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
            print(session)
            booking = Booking.objects.get(id=metadata['booking_id'])

            if booking.status != Booking.BookingStatus.PENDING:
                return Response({
                    'message': 'Booking has already been processed.'
                }, status=400)

            booking.points_earned = int(metadata['points_earned'])
            booking.points_spent = int(metadata['points_spent'])

            booking.stripe_payment_intent_id = session['payment_intent']
            booking.status = Booking.BookingStatus.CONFIRMED

            rebooked_from_id = metadata.get('rebooked_from')
            if rebooked_from_id:
                previous_booking = Booking.objects.get(id=rebooked_from_id)
                previous_booking.rebooked_to = booking
                booking.rebooked_from = previous_booking
                previous_booking.save()

            booking.user.account.travel_points += booking.points_earned
            booking.user.account.travel_points -= booking.points_spent

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
