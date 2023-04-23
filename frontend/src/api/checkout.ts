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

export function getCheckoutDetails(rateKey: string) {
  return fetch.get<CheckoutDetailsResponse>(`/checkout/${rateKey}/`);
}

type StripeCheckoutRequest = {
  rate_key: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  force: string;
  apply_point_balance: string;
};

type StripeCheckoutResponse = {
  id: string;
  url: string;
};

export function createStripeCheckout(params: StripeCheckoutRequest) {
  return fetch.post<StripeCheckoutRequest, StripeCheckoutResponse>('/checkout/', params);
}
