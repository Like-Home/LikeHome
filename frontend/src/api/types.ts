export type HotelPhoneType = 'PHONEMANAGEMENT' | 'PHONEBOOKING' | 'PHONEHOTEL' | 'FAXNUMBER';
export interface HotelbedsHotel {
  code: number;
  accommodationType: {
    code: string;
    typeMultiDescription: string;
    typeDescription: string;
  };
  address: string;
  category: {
    code: string;
    simpleCode: number;
    accommodationType: string;
    description: string;
    // ...
  };
  categoryGroup: {
    code: string;
    order: number;
    name: string;
    // ...
  };
  chain: {
    code: string;
    description: string;
  };
  city: string;
  countryCode: string;
  description: string;
  destinationCode: string;
  email: string;
  facilities: {
    id: number;
    order: number;
    number: number;
    voucher: boolean;
    // ...
  }[];
  google_map_url: string;
  images: {
    id: number;
    path: string;
    roomCode: any;
    roomType: any;
    // ...
  }[];
  interestPoints: {
    id: number;
    order: number;
    poiName: string;
    distance: number;
    facility: number;
    facilityGroup: number;
    // ...
  }[];
  latitude: number;
  longitude: number;
  name: string;
  phones: {
    id: number;
    phoneNumber: string;
    phoneType: HotelPhoneType;
    hotel: number;
    // ...
  }[];
  postalCode: string;
  ranking: number;
  rooms: {
    id: number;
    roomCode: string;
    isParentRoom: boolean;
    minPax: number;
    maxPax: number;
    maxAdults: number;
  }[];
  segments: {
    code: string;
    description: string;
  }[];
  stateCode: string;
  web: string;
  wildcards: {
    id: number;
    roomCode: string;
    roomType: string;
    characteristicCode: string;
    // ...
  }[];
}

export type BookingPostArgs = {
  force?: string; // 'true' or 'false'
};

export type PaginationResponse<T> = {
  links: {
    generic: string;
    next?: string;
    previous?: string;
  };
  page_total: number;
  page_size: number;
  total: number;
  results: T[];
};

export type BookingPutArgs = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type BookingCancelationStatusEnum = 'N' | 'F' | 'P';
export type BookingStatusEnum = 'PE' | 'CO' | 'CA' | 'RE' | 'IP' | 'PA';
export type Booking = BookingPutArgs & {
  id: number;
  stripe_payment_intent_id: string;
  amount_paid: number;
  points_earned: number;
  points_spent: number;
  status: BookingStatusEnum;
  user: number;
  created_at: string;
  hotel: HotelbedsHotel;
  overlapping: boolean;
  room_code: string;
  adults: string;
  rooms: number;
  room_name: string;
  image: string;
  children: string;
  check_in: string;
  check_out: string;
  refund_amount: number;
  cancelation_status: BookingCancelationStatusEnum;
  rebooked_to?: number; // Booking;
  rebooked_from?: number; // Booking;
  canceled_at?: string; // Booking;
};

export type UserPutArgs = {
  first_name: string;
  email: string;
  last_name: string;
  phone_number: string;
  autofill_booking_info: boolean;
};

export type User = {
  username: string;
  image: string;
  date_joined: string;
  groups: string[];
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  travel_points: number;
  user_permissions: string[];
} & UserPutArgs;
