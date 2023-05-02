import * as fetch from './fetch';
import { Booking, BookingPutArgs, PaginationResponse } from './types';

function objectToURLSearchParamsString(
  obj: Record<string, string | number | boolean | string[] | number[] | boolean[]>,
) {
  const qs = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((v) => qs.append(key, String(v)));
  });
  return qs.toString();
}

export function getBookingsByStatus(status: string | string[]) {
  const searchParams = objectToURLSearchParamsString({ status });
  return fetch.get<PaginationResponse<Booking>>(`/booking/?${searchParams}`);
}

export function getBookingsRewards() {
  return fetch.get<PaginationResponse<Booking>>(`/booking/rewards/`);
}

export function getBooking(id: string) {
  return fetch.get<Booking>(`/booking/${id}/`);
}

export function cancelBooking(id: number) {
  return fetch.get<Booking>(`/booking/${id}/cancel/`);
}

export function editBooking(id: number, booking: BookingPutArgs) {
  return fetch.put<BookingPutArgs, Booking>(`/booking/${id}/`, booking);
}
