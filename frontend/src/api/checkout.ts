import * as fetch from './fetch';
import { HotelbedsHotel } from './types';

export type PriceBook = {
  beforeTax: number;
  afterTax: number;
  tax: number;
};

type CheckoutDetailsResponse = {
  hotel: {
    code: string;
    name: string;
    checkIn: string;
    checkOut: string;
    rooms: {
      name: string;
      rates: {
        rateComments: string;
        rateKey: string;
        rateType: string;
        net: string;
        adults: number;
        children: number;
      }[];
    }[];
  };
  extended: HotelbedsHotel;
  price: PriceBook;
  rewards: {
    original: PriceBook;
    discounted: PriceBook;
    points: number;
    discount: number;
    free: boolean;
  };
};

type CheckoutDetails = CheckoutDetailsResponse & {
  guests: string;
  rooms: string;
};

export async function getCheckoutDetails(rateKey: string): Promise<CheckoutDetails> {
  const data = await fetch.get<CheckoutDetailsResponse>(`/checkout/${rateKey}/`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [from, to, unk0, unk1, hotelCode, roomCode, unk2, boardCode, unk3, guestsRooms, unk4, unk5] =
    atob(rateKey).split('|');
  const [guests, rooms] = guestsRooms.split('~');
  return { ...data, guests, rooms };
}

type StripeCheckoutRequest = {
  rate_key: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  force: string;
  apply_point_balance: string;
  rebooking_id?: string;
};

type StripeCheckoutResponse = {
  id: string;
  url: string;
};

export function createStripeCheckout(params: StripeCheckoutRequest) {
  return fetch.post<StripeCheckoutRequest, StripeCheckoutResponse>('/checkout/', params);
}
