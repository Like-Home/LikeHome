import * as fetch from './fetch';

// eslint-disable-next-line import/prefer-default-export
export function getHotel(hotelId: string) {
  // TODO: define this type
  return fetch.get<object>(`/hotel/${hotelId}/`);
}
