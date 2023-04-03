import * as fetch from './fetch';
import { Booking, BookingPost, BookingPostArgs } from './types';

export function getBookingHistory() {
  return fetch.get<Booking[]>('/booking');
}

export function getBooking(id: string) {
  return fetch.get<Booking>(`/booking/${id}`);
}

export function createBooking(booking: BookingPost & BookingPostArgs) {
  return fetch.post<BookingPost & BookingPostArgs, Booking>('/booking/', booking);
}
