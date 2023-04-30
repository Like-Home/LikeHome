import { Box, Stack, Typography, CardActionArea, Skeleton, Rating } from '@mui/material';
import Discount from '@mui/icons-material/Discount';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { OfferHotel } from '../api/search';
import { convertCategoryToRatingProps, priceBreakdown } from '../api/hotel';
import { formatCurrency } from '../utils';

export type onBookNowCallback = (hotel: OfferHotel) => void;

type HotelCardProps = {
  stay?: {
    nights: number;
    adults: number;
  };
  hotel: OfferHotel;
  onBookNow: onBookNowCallback;
};

export function HotelCardSkeleton({ small = false }: { small?: boolean }) {
  if (small)
    return (
      <div className="card" style={{ padding: 0, minWidth: 250, maxWidth: 250, height: 400 }}>
        <CardActionArea
          sx={{
            height: '100%',
          }}
        >
          <Stack direction="column" sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={150} />
            <Stack mx={1} direction="column" sx={{ flex: '60%', p: 2, height: '100%' }} justifyContent="space-between">
              <Skeleton width={200} height={70} />
              <Stack>
                <Skeleton width={200} height={30} />
                <Skeleton width={200} height={30} />
              </Stack>
            </Stack>
          </Stack>
        </CardActionArea>
      </div>
    );

  return (
    <div className="card" style={{ padding: 0 }}>
      <Stack style={{ display: 'flex', padding: 0 }} direction="row" alignItems="stretch">
        <Skeleton variant="rectangular" height={230} sx={{ flex: '33%' }} />
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

  const image = (
    <div
      style={{
        minHeight: stay ? 230 : 150,
        maxHeight: stay ? undefined : 150,
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url('${
          hotel.images[0]
            ? `https://photos.hotelbeds.com/giata/${hotel.images[0].path}`
            : `/images/placeholders/hotel.png`
        }')`,
        borderRadius: '4px 0 0 4px',
      }}
    />
  );

  const title = (
    <Typography variant="h5" sx={{ color: 'white', marginBottom: 1, marginTop: 1 }}>
      {hotel.name}
    </Typography>
  );

  const subtitle = (
    <Stack direction="row" justifyContent="space-between" alignItems="end">
      <Typography variant="caption" sx={{ opacity: 0.5 }}>
        {hotel.zoneName}
      </Typography>
      {hotel.categoryName && (
        <Rating size="small" name="rating" readOnly {...convertCategoryToRatingProps(hotel.categoryName)} />
      )}
    </Stack>
  );

  const info = (
    <Stack direction={'column'} justifyContent={'end'} spacing={2}>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.success.main,
          typography: { sm: 'body1', xs: 'body2' },
        }}
      >
        Fully refundable*
      </Typography>
      <Stack direction="row" spacing={1} alignItems={'center'}>
        <Discount color="primary" />
        <Typography sx={{ typography: { sm: 'body1', xs: 'body2' } }}>Reward Point Eligible</Typography>
      </Stack>
    </Stack>
  );

  // Simple version without price
  if (!stay) {
    return (
      <div className="card" style={{ padding: 0, minWidth: 250 }}>
        <CardActionArea
          onClick={onBookNowWrapper}
          sx={{
            height: '100%',
          }}
        >
          <Stack direction="column" sx={{ height: '100%' }}>
            {image}
            <Stack
              mx={1}
              direction="column"
              sx={{ flex: '60%', p: 2, height: '100%' }}
              justifyContent="space-between"
              spacing={1}
            >
              {title}
              {subtitle}
              {info}
            </Stack>
          </Stack>
        </CardActionArea>
      </div>
    );
  }

  const price = priceBreakdown(hotel.minRate, stay.nights, stay.adults);

  return (
    <div className="card" style={{ padding: 0 }}>
      <CardActionArea onClick={onBookNowWrapper}>
        <Grid container>
          <Grid xs={12} md={4}>
            {image}
          </Grid>
          <Grid xs={12} md={8}>
            <Stack mx={1} sx={{ flex: '60%', p: 2, height: '100%' }} justifyContent="space-between" spacing={1}>
              <Stack>
                {title}
                {subtitle}
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                {info}
                <Stack
                  sx={{
                    maxWidth: 90,
                    ml: 1,
                  }}
                >
                  <Typography variant="h5">
                    {formatCurrency(Math.round(price.perNightPerAdult * stay.adults) - 0.01)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    per night
                  </Typography>
                  <Typography variant="body1">{formatCurrency(price.afterTax)}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    total after tax
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardActionArea>
    </div>
  );
}
