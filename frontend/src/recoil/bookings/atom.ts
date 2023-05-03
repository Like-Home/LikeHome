import { atom, selector, selectorFamily } from 'recoil';
import { getBookingHistory, getBooking } from '../../api/bookings';
import { Booking } from '../../api/types';

export const bookingsSelector = selector({
  key: 'bookingsDefault',
  get: async () => getBookingHistory(),
});

// function bookingIdGetter(id: string): () => Promise<Booking>;
// function bookingIdGetter(id: null): () => Promise<null>;
function bookingIdGetter(id: string | null): () => Promise<Booking | null> {
  if (id === null) {
    return () => Promise.resolve(null);
  }
  return () => getBooking(id);
}

// bookingIdGetter('test')
// bookingIdGetter(null)

export const bookingById = selectorFamily({
  key: 'bookingByIdQuery',
  get: bookingIdGetter,
});

export default atom({
  key: 'bookingsAtom',
  default: bookingsSelector,
});
