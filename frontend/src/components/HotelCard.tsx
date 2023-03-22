import { Box, Stack, Button } from '@mui/material';

export type onBookNowCallback = (hotelId: string, roomId: string) => void;

type HotelCardProps = {
  hotelId: string;
  roomId: string;
  onBookNow: onBookNowCallback;
};

export default function HotelCard({ hotelId, roomId, onBookNow }: HotelCardProps) {
  const onBookNowWrapper = () => {
    onBookNow(hotelId, roomId);
  };

  return (
    <div className="card" style={{ display: 'flex', padding: 0 }}>
      <img src="/images/placeholders/hotel.png" style={{ height: 200 }} alt="" />
      <Box mx={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <h2 style={{ marginBottom: -8, marginTop: 16 }}>Hotel Name</h2>
          <h2 style={{ marginBottom: -8, marginTop: 16 }}>$60</h2>
        </Stack>
        <small style={{ opacity: 0.5 }}>Location</small>
        <p style={{ marginTop: 10, fontSize: 14 }}>
          {`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De...`}
        </p>
        <Button type="submit" sx={{ px: 5, fontSize: 20, width: '100%', marginBottom: 2 }} onClick={onBookNowWrapper}>
          Book Now
        </Button>
      </Box>
    </div>
  );
}
