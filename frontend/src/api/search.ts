import * as fetch from './fetch';
import { PaginationResponse } from './types';

export type OfferHotelRoomImage = {
  imageType: string;
  path: string;
  order: number;
};

export type OfferHotelRoomRateCancelationPolicy = {
  amount: string;
  from: string;
};

export type OfferHotelRoomRate = {
  rateKey: string;
  rateClass: string;
  rateType: string;
  net: string;
  allotment: number;
  paymentType: string;
  packaging: boolean;
  boardCode: string;
  boardName: string;
  cancellationPolicies: OfferHotelRoomRateCancelationPolicy[];
  rooms: number;
  adults: number;
  children: number;
};

export type OfferHotelRoom = {
  code: string;
  name: string;
  rates: OfferHotelRoomRate[];
  images: OfferHotelRoomImage[];
};

export type OfferHotel = {
  code: number;
  name: string;
  categoryCode: string;
  categoryName: string;
  destinationCode: string;
  destinationName: string;
  zoneCode: number;
  zoneName: string;
  latitude: string;
  longitude: string;
  rooms: OfferHotelRoom[];
  minRate: number;
  maxRate: number;
  currency: string;
  images: OfferHotelRoomImage[];
};

export type LocationOfferResults = PaginationResponse<OfferHotel>;
export type HotelOfferResults = PaginationResponse<OfferHotelRoom>;

type OfferParams = {
  // required
  checkin?: string;
  checkout?: string;
  rooms?: number;
  guests?: number;
  size?: number;
  // filters
  // TODO: add filters
};

export type OffersByLocation = {
  destinationCode?: string;
} & OfferParams;

export type OffersByHotel = {
  hotelCode?: number;
} & OfferParams;

export function getOffersByLocation({ destinationCode, checkin, checkout, rooms, guests, size = 5 }: OffersByLocation) {
  return fetch.get<LocationOfferResults>(
    `/destination/${destinationCode}/offers/?check_in=${checkin}&check_out=${checkout}&adults=${guests}&rooms=${rooms}&size=${size}`,
  );
}

export function getOffersByHotel({ hotelCode, checkin, checkout, rooms, guests }: OffersByHotel) {
  return fetch.get<HotelOfferResults>(
    `/hotel/${hotelCode}/offers/?check_in=${checkin}&check_out=${checkout}&adults=${guests}&rooms=${rooms}`,
  );
}
