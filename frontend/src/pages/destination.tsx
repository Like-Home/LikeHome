import { Card, Stack, Button, Typography, Box } from '@mui/material';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Discount from '@mui/icons-material/Discount';
import ShieldMoon from '@mui/icons-material/ShieldMoon';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import SearchBars from '../components/SearchBars';
import userAtom from '../recoil/user';
import Locations from '../data/locations';
import Photos from '../data/photos';
import { OfferHotel, getHotelsByLocation } from '../api/search';
import HotelCard, { HotelCardSkeleton } from '../components/HotelCard';
import Carousel from '../components/Carousel';

const iconStyle = {
  fontSize: 80,
};

export type DestinationPageParams = {
  code: string;
  name: string;
};

export default function DestinationPage() {
  const user = useRecoilValue(userAtom);
  const params = useParams<DestinationPageParams>();
  const code = params.code?.toUpperCase() ?? 'NYC';
  const [cityName, stateName] = Locations.get(code);
  const [bgImage, bgImageAttribution] = Photos.get(code);
  const [hotels, setHotels] = useState<OfferHotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    getHotelsByLocation(code).then((r) => {
      if (isMounted) {
        setHotels(r.results);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [code]);

  // TODO: This could be modal? Maybe
  const onBookNow = (hotel: OfferHotel) => {
    window.open(`/hotel/${hotel.code}/${slugify(hotel.name).toLowerCase()}/`, '_blank');
  };

  return (
    <>
      <main className="card card-root push-center" style={{ padding: 0, paddingBottom: 0 }}>
        <Stack spacing={2} style={{ padding: 24, paddingBottom: 12 }}>
          <Stack
            sx={{
              height: 500,
              background: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Stack
              sx={{
                height: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                p: 3,
                pb: 1,
              }}
            >
              <Stack
                className="card blur"
                sx={{
                  p: 3,
                }}
              >
                {' '}
                <Typography variant="h4">
                  Hotels in {cityName}, {stateName}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Choose your dates to see the latest hotel prices and availability in {cityName}.
                </Typography>
                <SearchBars location={{ code, name: `${cityName} - ${stateName}` }} />
              </Stack>
              <Typography variant="caption" textAlign="right" color="gray" fontWeight="bold" sx={{ mt: 'auto' }}>
                Photo: {bgImageAttribution}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Box sx={{ p: 3, px: 0, pt: 1 }}>
          <Typography variant="h5" sx={{ mb: 2, pl: 3, pt: 2 }}>
            Where to stay in {cityName}?
          </Typography>
          <Carousel>
            <Stack sx={{ px: 3, pb: 2 }} direction="row" spacing={2}>
              {hotels.length > 0 ? (
                hotels.map((hotel: OfferHotel) => <HotelCard key={hotel.code} hotel={hotel} onBookNow={onBookNow} />)
              ) : (
                <>
                  <HotelCardSkeleton small />
                  <HotelCardSkeleton small />
                  <HotelCardSkeleton small />
                  <HotelCardSkeleton small />
                  <HotelCardSkeleton small />
                </>
              )}
            </Stack>
          </Carousel>
        </Box>
      </main>
    </>
  );
}
