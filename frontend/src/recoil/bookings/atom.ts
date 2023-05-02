import { selectorFamily, selector } from 'recoil';
import { getBookingsRewards, getBookingsByStatus, getBooking } from '../../api/bookings';
import { Booking } from '../../api/types';

export const bookingsByStatusSelector = selectorFamily({
  key: 'bookingByStatusesQuery',
  get: (status: string | string[]) => () => getBookingsByStatus(status),
});

export const bookingRewardsSelector = selector({
  key: 'bookingRewardsQuery',
  get: () => getBookingsRewards(),
});

function bookingIdGetter(id: string | null): () => Promise<Booking | null> {
  if (id === null) {
    return () => Promise.resolve(null);
  }
  return () => getBooking(id);
}

export const bookingById = selectorFamily({
  key: 'bookingByIdQuery',
  get: bookingIdGetter,
});
