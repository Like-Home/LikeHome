import * as fetch from './fetch';
import { Booking, BookingPutArgs } from './types';

export function getBookingHistory() {
  return fetch.get<Booking[]>('/booking');
}

export function getBooking(id: string) {
  return fetch.get<Booking>(`/booking/${id}`);
}

export function cancelBooking(id: number) {
  return fetch.get<Booking>(`/booking/${id}/cancel/`);
}

export function editBooking(id: number, booking: BookingPutArgs) {
  return fetch.put<BookingPutArgs, Booking>(`/booking/${id}/`, booking);
}
