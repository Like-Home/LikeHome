import { Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import HotelCard, { onBookNowCallback } from '../components/HotelCard';
import SearchBars from '../components/SearchBars';
import { createBooking } from '../api/bookings';

interface SearchPageParams {
  q?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const { q: location, checkin, checkout, guests, rooms }: SearchPageParams = Object.fromEntries([...params]);

  console.log(location, rooms);

  const onBookNow: onBookNowCallback = (hotelId, roomId) => {
    createBooking({
      hotel_id: hotelId,
      room_id: roomId,
      guest_count: guests,
      start_date: `${checkin}T00:00:00Z`,
      end_date: `${checkout}T00:00:00Z`,
    });
  };

  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
      <SearchBars query={location} />
      <Stack sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography color="#999">Found 120 locations</Typography>
        <Stack spacing={3} mt={2} mb={3}>
          <HotelCard hotelId="1" roomId="1" onBookNow={onBookNow} />
          <HotelCard hotelId="2" roomId="1" onBookNow={onBookNow} />
        </Stack>
      </Stack>
    </main>
  );
}
