import traceback

from amadeus import Location, ResponseError
from api.modules.amadeus import amadeus
from django.http import JsonResponse


def search_city(req, param):
    if req.method == "GET":
        try:
            city_info = amadeus.reference_data.locations.get(
                keyword=param, subType=Location.CITY)
            city_code = []
            for i in city_info.data:
                city_code.append(i['iataCode'])
            return JsonResponse({
                "data": city_code
            })
        except ResponseError as error:
            print(error)
        return JsonResponse({"error": "Invalid request"})


def search_hotel(req, citycode, checkindata, checkoutdata, rooms, travelers):
    if req.method == "GET":
        try:
            hotel_list = amadeus.reference_data.locations.hotels.by_city.get(
                cityCode=citycode)

            hotel_names = []
            for i in hotel_list.data:
                hotel_names.append(i['hotelId'])

            hotel_offers = amadeus.shopping.hotel_offers_search.get(
                hotelIds=hotel_names[:10], adults=travelers, checkInDate=checkindata,
                checkOutDate=checkoutdata,
                roomQuantity=rooms)
            print(hotel_offers.data)
            return JsonResponse({"data": hotel_offers.data})
        except ResponseError as error:
            traceback.print_exc()
            print(error.response.data)
            print(error.code)
        return JsonResponse({"error": "Invalid request"})
