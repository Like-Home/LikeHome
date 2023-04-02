import { Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import HotelCard, { onBookNowCallback } from '../components/HotelCard';
import SearchBars, { SearchPageParams, onSearchProps } from '../components/SearchBars';
import { getOffersByLocation, OfferHotel } from '../api/search';

export default function SearchPage() {
  const [rawParams] = useSearchParams();
  const params: SearchPageParams = Object.fromEntries([...rawParams]);

  const location = JSON.parse(atob(params.location || ''));

  const [results, setResults] = useState<OfferHotel[]>([]);
  const [resultsMessage, setResultsMessage] = useState('...');

  const onBookNow: onBookNowCallback = (hotel) => {
    window.open(
      `/hotel/${hotel.code}/${slugify(hotel.name).toLowerCase()}/?checkin=${params.checkin}&checkout=${
        params.checkout
      }&guests=${params.guests}&rooms=${params.rooms}`,
      '_blank',
    );
  };

  async function onSearch(kwargs: onSearchProps) {
    const response = await getOffersByLocation({
      destinationCode: kwargs?.location?.pk,
      checkin: kwargs.checkin,
      checkout: kwargs.checkout,
      guests: Number(kwargs.guests),
      rooms: Number(kwargs.rooms),
    });

    setResults(response.offers.hotels);
    setResultsMessage(`Found ${response.offers.total} hotels`);
  }

  useEffect(() => {
    onSearch({
      location,
      checkin: params.checkin,
      checkout: params.checkout,
      guests: params.guests,
      rooms: params.rooms,
    });
  }, []);

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
      <Stack sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography color="#999">{resultsMessage}</Typography>
        <Stack spacing={3} mt={2} mb={3}>
          {results.map((hotel) => (
            <HotelCard key={hotel.code} hotel={hotel} onBookNow={onBookNow} />
          ))}
        </Stack>
      </Stack>
    </main>
  );
}
