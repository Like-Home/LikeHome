import json
import os
import traceback
from abc import ABC, abstractmethod
from ast import List
from typing import Tuple
from urllib.parse import urlencode

from config import cache_dir, fixtures_dir


class APIResource(ABC):
    def __init__(self, path: str, key: str):
        self.path = path
        self.key = key
        self.id = path[1:].replace("/", "_")
        self.fixtures_path = os.path.join(
            fixtures_dir, f'{self.id}.fixture.json')
        self.cache_path = os.path.join(cache_dir, f'{self.id}.json')

    def extract_from_response(self, response: dict) -> list:
        return response[self.key]

    def create_url(self, from_index: int, to_index: int) -> str:
        query_params = {
            'fields': 'all',
            'countryCode': 'US',  # API docs are wrong, from Postman for Hotels
            'countryCodes': 'US',  # for Destinations
            'language': 'ENG',
            'from': from_index,
            'to': to_index,
            'useSecondaryLanguage': 'false'
        }
        return f'{self.path}?{urlencode(query_params)}'

    def read(self) -> list:
        with open(self.cache_path, 'r') as f:
            return json.load(f)

    def write(self, records: list):
        with open(self.cache_path, 'w') as f:
            json.dump(records, f, indent=2)

    def __repr__(self):
        return f'APIResource({self.path}, {self.key})'

    def translate_to_fixture(self):
        records = self.read()

        translated = []
        for item in records:
            data = self.transform(item)

            if data is not None:
                if isinstance(data, list):
                    translated.extend(data)
                else:
                    translated.append(data)

        with open(self.fixtures_path, 'w') as f:
            json.dump(translated, f, indent=2)

    @abstractmethod
    def transform(self, item):
        pass


def code_with_description(model, item):
    return {
        'model': model,
        'pk': item['code'],
        'fields': {
            'description': item.get('description', {}).get('content', ''),
        }
    }


class PrimaryKey:
    def __init__(self, start: int):
        self.start = start

    def use(self) -> int:
        self.start += 1
        return self.start


class APIResourceHotel(APIResource):
    """
    segments = models.ManyToManyField(HotelbedsSegment)

    web = models.CharField(max_length=255)
    ranking = models.IntegerField()

    address = models.CharField(max_length=255)
    postalCode = models.CharField(max_length=10)
    city = models.CharField(max_length=255)"""

    phone_pk = PrimaryKey(0)
    room_pk = PrimaryKey(0)
    image_pk = PrimaryKey(0)
    facility_pk = PrimaryKey(0)
    room_facility_pk = PrimaryKey(0)
    room_stay_pk = PrimaryKey(0)
    room_stay_facility_pk = PrimaryKey(0)
    interest_points_pk = PrimaryKey(0)
    wildcards_pk = PrimaryKey(0)

    def transform(self, item):
        try:
            hotel_id = item['code']

            records = [
                {
                    'model': 'api.HotelbedsHotel',
                    'pk': hotel_id,
                    'fields': {
                        'name': item['name']['content'],
                        'description': item.get('description', {}).get('content', ''),
                        'countryCode': item['countryCode'],
                        'stateCode': item['stateCode'],
                        'destinationCode': item['destinationCode'],
                        'longitude': item['coordinates']['longitude'],
                        'latitude': item['coordinates']['latitude'],
                        'category': item['categoryCode'],
                        'categoryGroup': item.get('categoryGroupCode'),
                        'chain': item.get('chainCode'),
                        'accommodationType': item['accommodationTypeCode'],
                        'segments': item.get('segmentCodes', []),
                        'web': item.get('web'),
                        'email': item.get('email'),
                        'ranking': item['ranking'],
                        'address': item['address']['content'],
                        'postalCode': item.get('postalCode', ''),
                        'city': item['city']['content'],
                    }
                }
            ]

            for phone in item.get('phones', []):
                records.append({
                    'model': 'api.HotelbedsHotelPhone',
                    'pk': self.phone_pk.use(),
                    'fields': {
                        'phoneNumber': phone['phoneNumber'],
                        'phoneType': phone['phoneType'],
                        'hotel': hotel_id,
                    }
                })

            for image in item.get('images', []):
                records.append({
                    'model': 'api.HotelbedsHotelImage',
                    'pk': self.image_pk.use(),
                    'fields': {
                        'imageType': image['imageTypeCode'],
                        'path': image['path'],
                        'roomCode': image.get('roomCode'),
                        'roomType': image.get('roomType'),
                        'characteristicCode': image.get('characteristicCode'),
                        'order': image['order'],
                        'visualOrder': image['visualOrder'],
                        'hotel': hotel_id,
                    }
                })

            for facility in item.get('facilities', []):
                records.append({
                    'model': 'api.HotelbedsHotelFacility',
                    'pk': self.facility_pk.use(),
                    'fields': {
                        'facility': facility['facilityCode'],
                        'facilityGroup': facility['facilityGroupCode'],
                        'order': facility['order'],
                        'number': facility.get('number', 0),
                        'voucher': facility['voucher'],
                        'hotel': hotel_id,
                    }
                })

            for interest_point in item.get('interestPoints', []):
                records.append({
                    'model': 'api.HotelbedsHotelInterestPoint',
                    'pk': self.interest_points_pk.use(),
                    'fields': {
                        'facility': interest_point['facilityCode'],
                        'facilityGroup': interest_point['facilityGroupCode'],
                        'order': interest_point['order'],
                        'poiName': interest_point.get('poiName'),
                        'distance': interest_point['distance'],
                        'hotel': hotel_id,
                    }
                })

            for wildcard in item.get('wildcards', []):
                records.append({
                    'model': 'api.HotelbedsHotelWildcard',
                    'pk': self.wildcards_pk.use(),
                    'fields': {
                        'roomType': wildcard['roomType'],
                        'roomCode': wildcard['roomCode'],
                        'characteristicCode': wildcard['characteristicCode'],
                        'hotelRoomDescription': wildcard['hotelRoomDescription']['content'],
                        'hotel': hotel_id,
                    }
                })

            for room in item.get('rooms', []):
                room_pk = self.room_pk.use()
                records.append({
                    'model': 'api.HotelbedsHotelRoom',
                    'pk': room_pk,
                    'fields': {
                        "roomCode": room['roomCode'],
                        "isParentRoom": room['isParentRoom'],
                        "minPax": room['minPax'],
                        "maxPax": room['maxPax'],
                        "maxAdults": room['maxAdults'],
                        "maxChildren": room['maxChildren'],
                        "minAdults": room['minAdults'],
                        "roomType": room['roomType'],
                        "characteristicCode": room['characteristicCode'],
                        "PMSRoomCode": room.get('PMSRoomCode'),
                        'hotel': hotel_id
                    }
                })

                for roomFacility in room.get('roomFacilities', []):
                    records.append({
                        'model': 'api.HotelbedsHotelRoomFacility',
                        'pk': self.room_facility_pk.use(),
                        'fields': {
                            'facility': roomFacility['facilityCode'],
                            'facilityGroup': roomFacility['facilityGroupCode'],
                            'indLogic': roomFacility.get('indLogic'),
                            'indFee': roomFacility.get('indFee'),
                            'indYesOrNo': roomFacility.get('indYesOrNo'),
                            'number': roomFacility.get('number', 0),
                            'voucher': roomFacility['voucher'],
                            'room': room_pk,
                        }
                    })

                for room_stay in room.get('roomStays', []):
                    room_stay_facility_pk = self.room_stay_pk.use()
                    records.append({
                        'model': 'api.HotelbedsHotelRoomStay',
                        'pk': room_stay_facility_pk,
                        'fields': {
                            "stayType": room_stay['stayType'],
                            "order": room_stay['order'],
                            "description": room_stay.get('description', ''),
                            'room': room_pk,
                        }
                    })

                    for room_stay_facility in room_stay.get('roomStayFacilities', []):
                        records.append({
                            'model': 'api.HotelbedsHotelRoomStayFacility',
                            'pk': self.room_stay_facility_pk.use(),
                            'fields': {
                                "facility": room_stay_facility['facilityCode'],
                                "facilityGroup": room_stay_facility['facilityGroupCode'],
                                "number": room_stay_facility['number'],
                                'stay': room_stay_facility_pk
                            }
                        })

            return records
        except Exception as e:
            traceback.print_exc()
            # print(item)
        return []


class APIResourceDestination(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsDestinationLocation',
            'pk': item['code'],
            'fields': {
                'name': item['name']['content'],
                'countryCode': item['countryCode'],
                'isoCode': item['isoCode'],
            }
        }


class APIResourceAccommodation(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsAccommodation',
            'pk': item['code'],
            'fields': {
                'typeMultiDescription': item['typeMultiDescription']['content'],
                'typeDescription': item['typeDescription'],
            }
        }


class APIResourceBoard(APIResource):
    def transform(self, item):
        pass


class APIResourceBoardGroup(APIResource):
    def transform(self, item):
        pass


class APIResourceCategory(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsCategory',
            'pk': item['code'],
            'fields': {
                'simpleCode': item['simpleCode'],
                'accommodationType': item.get('accommodationType'),
                'group': item.get('group'),
                'description': item.get('description', {}).get('content', None),
            }
        }


class APIResourceChain(APIResource):
    def transform(self, item):
        return code_with_description('api.HotelbedsChain', item)


class APIResourceClassification(APIResource):
    def transform(self, item):
        return code_with_description('api.HotelbedsClassification', item)


class APIResourceCurrency(APIResource):
    def transform(self, item):
        pass


class APIResourceFacility(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsFacility',
            'pk': item['code'],
            'fields': {
                'facilityGroup': item['facilityGroupCode'],
                'facilityTypology': item['facilityTypologyCode'],
                'description': item.get('description', {}).get('content', None),
            }
        }


class APIResourceFacilityGroup(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsFacilityGroup',
            'pk': item['code'],
            'fields': {
                'description': item['description']['content'],
            }
        }


class APIResourceFacilityTypology(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsFacilityTypology',
            'pk': item.pop('code'),
            'fields': item
        }


class APIResourceGroupCategory(APIResource):
    """
    {
    "code": "GRUPO2",
    "order": 2,
    "name": {
      "content": "Includes 2-star hotels, standard,  mini hotels, re"
    },
    "description": {
      "content": "Includes 2-star hotels, standard,  mini hotels, residences and rural hotels."
    }
  },"""

    def transform(self, item):
        return {
            'model': 'api.HotelbedsGroupCategory',
            'pk': item['code'],
            'fields': {
                'order': item['order'],
                'name': item['name']['content'],
                'description': item['description']['content'],
            }
        }


class APIResourceImageType(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsImageType',
            'pk': item['code'],
            'fields': {
                'description': item['description']['content'],
            }
        }


class APIResourceIssue(APIResource):
    def transform(self, item):
        pass


class APIResourceLanguage(APIResource):
    def transform(self, item):
        pass


class APIResourcePromotion(APIResource):
    def transform(self, item):
        pass


class APIResourceRoom(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsRoom',
            'pk': item['code'],
            'fields': {
                'type': item['type'],
                'characteristic': item['characteristic'],
                'minPax': item['minPax'],
                'maxPax': item['maxPax'],
                'maxAdults': item['maxAdults'],
                'maxChildren': item['maxChildren'],
                'minAdults': item['minAdults'],
                'description': item.get('description', None),
                'typeDescription': item.get('typeDescription', {}).get('content', None),
                'characteristicDescription': item.get('characteristicDescription', {}).get('content', None),
            }
        }


class APIResourceSegment(APIResource):
    def transform(self, item):
        return {
            'model': 'api.HotelbedsSegment',
            'pk': item['code'],
            'fields': {
                'description': item['description']['content'],
            }
        }


api_resources: Tuple[APIResource, ...] = (
    APIResourceHotel('/hotels', 'hotels'),
    APIResourceDestination('/locations/destinations', 'destinations'),
    APIResourceAccommodation('/types/accommodations', 'accommodations'),
    # APIResourceBoard('/types/boards', 'boards'),
    # APIResourceBoardGroup('/types/boardgroups', 'boardGroups'),
    APIResourceCategory('/types/categories', 'categories'),
    APIResourceChain('/types/chains', 'chains'),
    APIResourceClassification('/types/classifications', 'classifications'),
    # APIResourceCurrency('/types/currencies', 'currencies'),
    APIResourceFacility('/types/facilities', 'facilities'),
    APIResourceFacilityGroup('/types/facilitygroups', 'facilityGroups'),
    APIResourceFacilityTypology(
        '/types/facilitytypologies', 'facilityTypologies'),
    APIResourceGroupCategory('/types/groupcategories', 'groupCategories'),
    APIResourceImageType('/types/imagetypes', 'imageTypes'),
    # APIResourceIssue('/types/issues', 'issues'),
    # APIResourceLanguage('/types/languages', 'languages'),
    # APIResourcePromotion('/types/promotions', 'promotions'),
    # START ignore
    # ('/types/ratecommentdetails', 'rateCommentDetails'),
    # ('/types/ratecomments', 'rateComments'),
    # END ignore
    APIResourceRoom('/types/rooms', 'rooms'),
    APIResourceSegment('/types/segments', 'segments'),
)

# api_resources[0].cache_path = '/Users/vulcan/Documents/sjsu/2022/spring/CMPE-165/project/LikeHome/backend/util/example-hotel.json'
