import { Stack, Typography, Button } from '@mui/material';

import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState, Suspense } from 'react';
import slugify from 'slugify';
import usePromise from 'react-promise-suspense';
import AppLoadingSpinner from '../components/AppLoadingSpinner';
import HotelCard, { onBookNowCallback } from '../components/HotelCard';
import SearchBars, { SearchPageParams, onSearchProps } from '../components/SearchBars';
import { getOffersByLocation } from '../api/search';
import Result from '../components/Result';

function OfferHotels({
  kwargs,
}: {
  kwargs: {
    destinationCode: string;
    checkin: string;
    checkout: string;
    guests: number;
    rooms: number;
  };
}) {
  const [rawParams] = useSearchParams();
  const params: SearchPageParams = Object.fromEntries([...rawParams]);

  const resource = usePromise(getOffersByLocation, [kwargs]);

  const onBookNow: onBookNowCallback = (hotel) => {
    window.open(
      `/hotel/${hotel.code}/${slugify(hotel.name).toLowerCase()}/?checkin=${params.checkin}&checkout=${
        params.checkout
      }&guests=${params.guests}&rooms=${params.rooms}`,
      '_blank',
    );
  };

  return (
    <>
      <Typography color="#999">Found {resource.results.length} hotels</Typography>
      <Stack spacing={3} mt={2} mb={3}>
        {resource.results.length === 0 ? (
          <Result variant="info" hidePrimaryButton={true}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="body1" component="p">
                There are no hotels available for the selected dates at this location.
              </Typography>
              <Typography variant="body1" component="p">
                Please try again with different dates or another location.
              </Typography>
            </Stack>
          </Result>
        ) : (
          resource.results.map((hotel) => (
            <HotelCard key={hotel.code} hotel={hotel} onBookNow={() => onBookNow(hotel)} />
          ))
        )}
      </Stack>
    </>
  );
}

interface setOfferHotelsArgsProps {
  destinationCode?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  rooms?: number;
}

function pageParamsAreInvalid(params: setOfferHotelsArgsProps) {
  return !params.destinationCode || !params.checkin || !params.checkout || !params.guests || !params.rooms;
}

export default function SearchPage() {
  const [rawParams] = useSearchParams();
  const params: SearchPageParams = Object.fromEntries([...rawParams]);
  const location = JSON.parse(atob(params.location || ''));

  const [offerHotelsArgs, setOfferHotelsArgs] = useState<setOfferHotelsArgsProps>({
    destinationCode: location?.code,
    checkin: params.checkin,
    checkout: params.checkout,
    guests: Number(params.guests),
    rooms: Number(params.rooms),
  });

  // show loading animation
  async function onSearch(kwargs: onSearchProps) {
    // update url params
    const searchParams = new URLSearchParams();
    searchParams.set('location', btoa(JSON.stringify(kwargs.location)));
    searchParams.set('checkin', kwargs.checkin || '');
    searchParams.set('checkout', kwargs.checkout || '');
    searchParams.set('guests', kwargs.guests || '');
    searchParams.set('rooms', kwargs.rooms || '');
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    setOfferHotelsArgs({
      destinationCode: kwargs.location?.code,
      checkin: kwargs.checkin,
      checkout: kwargs.checkout,
      guests: Number(kwargs.guests),
      rooms: Number(kwargs.rooms),
    });
  }

  useEffect(() => {
    if (pageParamsAreInvalid(offerHotelsArgs)) {
      return;
    }

    onSearch({
      location,
      checkin: params.checkin,
      checkout: params.checkout,
      guests: params.guests,
      rooms: params.rooms,
    });
  }, []);

  if (pageParamsAreInvalid(offerHotelsArgs)) {
    return (
      <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
        <p>Something seems to be missing in the URL.</p>
        <Button component={Link} to="/">
          Go Home
        </Button>
      </main>
    );
  }

  return (
    <main className="card push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
      <SearchBars
        location={location}
        guests={params.guests}
        rooms={params.rooms}
        checkin={params.checkin}
        checkout={params.checkout}
        onSearch={onSearch}
      />
      <Suspense fallback={<AppLoadingSpinner />}>
        <OfferHotels
          kwargs={
            // TODO: clean up the types validated in the if above
            offerHotelsArgs as {
              destinationCode: string;
              checkin: string;
              checkout: string;
              guests: number;
              rooms: number;
            }
          }
        />
      </Suspense>
    </main>
  );
}
