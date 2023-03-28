import * as fetch from './fetch';

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
  minRate: string;
  maxRate: string;
  currency: string;
  images: OfferHotelRoomImage[];
};

export type OfferResults = {
  offers: {
    hotels: OfferHotel[];
    checkin: string;
    checkout: string;
    total: number;
  };
};

type OfferParams = {
  // required
  destinationCode?: string;
  checkin?: string;
  checkout?: string;
  rooms?: number;
  guests?: number;
  // filters
  // TODO: add filters
};

// eslint-disable-next-line import/prefer-default-export
export function getOffers({ destinationCode, checkin, checkout, rooms, guests }: OfferParams) {
  return fetch.get<OfferResults>(`/search_hotel/${destinationCode}/${checkin}/${checkout}/${rooms}/${guests}`);
}
