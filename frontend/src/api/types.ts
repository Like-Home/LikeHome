export interface Booking {
  id: number;
  stripe_id: string;
  hotel_id: string;
  room_id: string;
  amount_paid: number;
  guest_count: number;
  points_earned: number;
  status: string;
  user: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface User {
  username: string;
  email: string;
}
