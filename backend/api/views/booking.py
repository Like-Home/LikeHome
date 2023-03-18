import stripe
from api.models.Booking import Booking
from api.serializers import BookingSerializer
from app.config import STRIPE_ENDPOINT_SECRET
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


class BookingView(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        return Booking.objects.filter(user=self.request.user)

    def get_object(self):
        """Get a single booking object by pk

        Returns:
            _type_: _description_
        """
        pk = self.kwargs.get('pk')

        if pk is not None:
            return Booking.objects.get(id=pk, user=self.request.user)

        return super().get_object()


def stripe_create_checkout(hotel_name, room_number, check_in, check_out, hotel_price, hotel_image):
    domain_url = 'http://localhost:8080/'
    return stripe.checkout.Session.create(
        success_url=domain_url + 'success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url=domain_url + 'cancelled/',
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
                        "description": f"Room {room_number} from {check_in} to {check_out}",
                        "images": [hotel_image],
                    },
                },
                "quantity": 1,
            }
        ]
    )


def create_checkout_session(request: Request) -> HttpResponse | None:
    if request.method == 'GET':
        try:
            # Create new Checkout Session for the order
            # Other optional params include:
            # [billing_address_collection] - to display billing address details on the page
            # [customer] - if you have an existing Stripe Customer ID
            # [payment_intent_data] - capture the payment later
            # [customer_email] - prefill the email input in the form
            # For full details see https://stripe.com/docs/api/checkout/sessions/create

            # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            checkout_session = stripe_create_checkout(
                'Hotel California',
                '101',
                '2021-01-01',
                '2021-01-02',
                100,
                'https://images.unsplash.com/photo-1517436073-7d0a6a5b1f4e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjBjYWxpZm9ybmlhJTIwY2hpbmV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80'
            )
            return JsonResponse(checkout_session)
        except Exception as e:
            return JsonResponse({'error': str(e)})


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_ENDPOINT_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        print("Payment was successful.")
        # TODO: confirm payment was successful on the backend

    return HttpResponse(status=200)
