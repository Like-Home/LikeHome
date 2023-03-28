import { Box, Stack, Button } from '@mui/material';
import { OfferHotel } from '../api/search';

export type onBookNowCallback = (hotel: OfferHotel) => void;

type HotelCardProps = {
  hotel: OfferHotel;
  onBookNow: onBookNowCallback;
};

export default function HotelCard({ hotel, onBookNow }: HotelCardProps) {
  const onBookNowWrapper = () => {
    onBookNow(hotel);
  };

  return (
    // <div className="card" style={{ display: 'flex', padding: 0 }}>
    <Stack direction="row" alignItems="stretch">
      <div
        style={{
          flex: '33%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('http://photos.hotelbeds.com/giata/${hotel.images[0].path}')`,
          borderRadius: '4px 0 0 4px',
        }}
      ></div>
      <Box mx={2} sx={{ flex: '66%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <h2 style={{ marginBottom: -8, marginTop: 0 }}>{hotel.name}</h2>
          <h4 style={{ marginBottom: -8, marginTop: 16 }}>${hotel.minRate}</h4>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <small style={{ opacity: 0.5 }}>{hotel.zoneName}</small>
          <small style={{ opacity: 0.5 }}>{hotel.categoryName}</small>
        </Stack>
        <p style={{ marginTop: 10, fontSize: 14 }}>
          {`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De...`}
        </p>
        <Button type="submit" sx={{ px: 5, fontSize: 20, width: '100%', marginTop: 2 }} onClick={onBookNowWrapper}>
          View
        </Button>
      </Box>
    </Stack>
    // </div>
  );
}
