import * as fetch from './fetch';
import { Booking } from './types';

export function getBookingHistory() {
  return fetch.get<Booking[]>('/booking');
}

export function getBooking(id: string) {
  return fetch.get<Booking>(`/booking/${id}`);
}

export function cancelBooking(id: number) {
  return fetch.get<Booking>(`/booking/${id}/cancel/`);
}

export function editBooking(id: number) {
  return fetch.get<Booking>(`/booking/${id}/edit/`);
}
