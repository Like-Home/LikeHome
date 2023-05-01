import { BookingStatusEnum, BookingCancelationStatusEnum, HotelPhoneType } from './api/types';

export const statusToText: Record<BookingStatusEnum, string> = {
  PE: 'Pending',
  CO: 'Confirmed',
  CA: 'Canceled',
  RE: 'Rebooked',
  IP: 'In Progress',
  PA: 'Past',
};

type Color = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export const statusToColor: Record<BookingStatusEnum, Color> = {
  PE: 'info',
  CO: 'success',
  CA: 'error',
  RE: 'warning',
  IP: 'primary',
  PA: 'secondary',
};

export const cancelationStatusToText: Record<BookingCancelationStatusEnum, string> = {
  N: 'None',
  F: 'Full',
  P: 'Partial',
};

export const phoneTypeToText: Record<HotelPhoneType, string> = {
  PHONEBOOKING: 'Booking',
  PHONEHOTEL: 'Hotel Lobby',
  FAXNUMBER: 'Fax',
  PHONEMANAGEMENT: 'Management',
};
