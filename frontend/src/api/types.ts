export type BookingPostArgs = {
  force?: string; // 'true' or 'false'
};

export type BookingPutArgs = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type Booking = BookingPutArgs & {
  id: number;
  stripe_id: string;
  amount_paid: number;
  points_earned: number;
  points_spent: number;
  status: string;
  user: number;
  created_at: string;
  hotel: {
    name: string;
  };
  room_code: string;
  adults: string;
  image: string;
  children: string;
  check_in: string;
  check_out: string;
};

export type User = {
  username: string;
  email: string;
};
