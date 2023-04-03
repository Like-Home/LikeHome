import * as fetch from './fetch';

type CheckoutDetailsResponse = {
  hotel: {
    name: string;
    rooms: {
      name: string;
      rates: {
        rateComments: string;
      }[];
    }[];
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
};

type StripeCheckoutResponse = {
  id: string;
  url: string;
};

export function createStripeCheckout(params: StripeCheckoutRequest) {
  return fetch.post<StripeCheckoutRequest, StripeCheckoutResponse>('/checkout/', params);
}
