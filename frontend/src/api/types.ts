export type BookingPostArgs = {
  force?: boolean;
};

export type BookingPost = {
  hotel_id: string;
  room_id: string;
  guest_count: string;
  start_date: string;
  end_date: string;
};

export type Booking = {
  id: number;
  stripe_id: string;
  amount_paid: number;
  points_earned: number;
  status: string;
  user: number;
  created_at: string;
} & BookingPost;

export type User = {
  username: string;
  email: string;
};
