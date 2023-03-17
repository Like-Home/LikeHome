import { atom, selector, selectorFamily } from 'recoil';
import { getBookingHistory, getBooking } from '../../api/bookings';

export const bookingsSelector = selector({
  key: 'bookingsDefault',
  get: async () => getBookingHistory().catch(() => []),
});

export const bookingById = selectorFamily({
  key: 'bookingByIdQuery',
  get: (id: string) => () => getBooking(id),
});

export default atom({
  key: 'bookingsAtom',
  default: bookingsSelector,
});
