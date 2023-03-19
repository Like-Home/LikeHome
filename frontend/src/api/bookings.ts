import * as fetch from './fetch';
import { Booking } from './types';

export function getBookingHistory() {
  return fetch.get<Booking[]>('/booking');
}

export function getBooking(id: string) {
  return fetch.get<Booking>(`/booking/${id}`);
}
