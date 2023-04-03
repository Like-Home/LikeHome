export type BookingPostArgs = {
  force?: string; // 'true' or 'false'
};

export type Booking = {
  id: number;
  stripe_id: string;
  amount_paid: number;
  points_earned: number;
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
