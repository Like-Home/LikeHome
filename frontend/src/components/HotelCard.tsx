import { Box, Stack, Typography, CardActionArea, Skeleton, Rating } from '@mui/material';
import { Discount } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { OfferHotel } from '../api/search';
import { convertCategoryToRatingProps, priceBreakdown } from '../api/hotel';
import { formatCurrency } from '../utils';

export type onBookNowCallback = (hotel: OfferHotel) => void;

type HotelCardProps = {
  stay: {
    nights: number;
    adults: number;
  };
  hotel: OfferHotel;
  onBookNow: onBookNowCallback;
};

export function HotelCardSkeleton() {
  return (
    <div className="card" style={{ padding: 0 }}>
      <Stack style={{ display: 'flex', padding: 0 }} direction="row" alignItems="stretch">
        <Skeleton variant="rectangular" height={173} sx={{ flex: '33%' }} />
        <Box mx={2} sx={{ flex: '66%', p: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="end">
            <h2 style={{ marginBottom: 2, marginTop: 8 }}>
              <Skeleton width={200} />
            </h2>
            <h2 style={{ marginBottom: 2, marginTop: 16 }}>
              <Skeleton width={50} />
            </h2>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="end">
            <small style={{ opacity: 0.5 }}>
              <Skeleton width={150} />
            </small>
            <small style={{ opacity: 0.5 }}>
              <Skeleton width={100} />
            </small>
          </Stack>
          <p style={{ marginTop: 10, fontSize: 14 }}>
            <Skeleton width={350} height={50} />
          </p>
        </Box>
      </Stack>
    </div>
  );
}

export default function HotelCard({ stay, hotel, onBookNow }: HotelCardProps) {
  const theme = useTheme();
  const onBookNowWrapper = () => {
    onBookNow(hotel);
  };

  const price = priceBreakdown(hotel.minRate, stay.nights, stay.adults);

  return (
    <div className="card" style={{ padding: 0 }}>
      <CardActionArea onClick={onBookNowWrapper}>
        <Stack style={{ display: 'flex', padding: 0 }} direction="row" alignItems="stretch" spacing={1}>
          <div
            style={{
              flex: '40%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url('https://photos.hotelbeds.com/giata/${hotel.images[0].path}')`,
              borderRadius: '4px 0 0 4px',
            }}
          ></div>
          <Stack mx={1} sx={{ flex: '60%', p: 1.5 }} spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="end">
              <Typography variant="h5" sx={{ color: 'white', marginBottom: 1, marginTop: 1 }}>
                {hotel.name}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="end">
              <Typography variant="caption" sx={{ opacity: 0.5 }}>
                {hotel.zoneName}
              </Typography>
              {hotel.categoryName && (
                <Rating size="small" name="rating" readOnly {...convertCategoryToRatingProps(hotel.categoryName)} />
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction={'column'} justifyContent={'end'} spacing={2}>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.success.main,
                  }}
                >
                  Fully refundable*
                </Typography>
                <Stack direction="row" spacing={1} alignItems={'center'}>
                  <Discount color="primary" />
                  <Typography variant="body1">Reward Point Eligible</Typography>
                </Stack>
              </Stack>
              <Stack
                sx={{
                  maxWidth: 90,
                }}
              >
                <Typography variant="h5">{formatCurrency(Math.round(price.perNightPerAdult) - 0.01)}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                  per adult per night
                </Typography>
                <Typography variant="body1">{formatCurrency(price.afterTax)}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                  total after tax
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </div>
  );
}
