import {
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Skeleton,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import HotelCard, { HotelCardSkeleton, onBookNowCallback } from '../components/HotelCard';
import SearchBars, { SearchPageParams, onSearchProps } from '../components/SearchBars';
import { getOffersByLocation, OfferHotel } from '../api/search';
import Spinner from '../components/Spinner';
import PriceSlider from '../components/controls/PriceSlider';

type ZoneInfo = {
  code: number | string;
  name: string;
  count: number;
};

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

  // Data
  const [results, setResults] = useState<OfferHotel[]>([]);
  const [sorted, setSorted] = useState<OfferHotel[]>([]);
  const [filtered, setFiltered] = useState<OfferHotel[]>([]);
  const [zones, setZones] = useState<ZoneInfo[]>([]);
  const [resultsMessage, setResultsMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Sort and filter parameters
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [zone, setZone] = useState<string | null>(null);
  const [sort, setSort] = useState('suggested');

  // TODO: This could be modal? Maybe
  const onBookNow: onBookNowCallback = (hotel) => {
    window.open(
      `/hotel/${hotel.code}/${slugify(hotel.name).toLowerCase()}/?checkin=${params.checkin}&checkout=${
        params.checkout
      }&guests=${params.guests}&rooms=${params.rooms}`,
      '_blank',
    );
  };

  async function onSearch(kwargs: onSearchProps) {
    // update url params
    const searchParams = new URLSearchParams();
    searchParams.set('location', btoa(JSON.stringify(kwargs.location)));
    searchParams.set('checkin', kwargs.checkin || '');
    searchParams.set('checkout', kwargs.checkout || '');
    searchParams.set('guests', kwargs.guests || '');
    searchParams.set('rooms', kwargs.rooms || '');
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    setResultsMessage('Searching...');
    setZones([]);
    setResults([]);
    setSorted([]);
    setFiltered([]);
    setLoading(true);

    const args = {
      destinationCode: kwargs?.location?.code,
      checkin: kwargs.checkin,
      checkout: kwargs.checkout,
      guests: Number(kwargs.guests),
      rooms: Number(kwargs.rooms),
    };

    setOfferHotelsArgs(args);

    // Do a delayed request
    // TODO: Exclude the first page of 5 somehow
    setTimeout(
      () =>
        getOffersByLocation({ ...args, size: 100 }).then((res) => {
          setLoading(false);
          setResults(res.results);
        }),
      1000,
    );

    // Do an immediate request
    const response = await getOffersByLocation({ ...args, size: 5 });
    if (results.length < 5) setResults(response.results);
  }

  // Begin search
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

  // Setup results
  useEffect(() => {
    // Compute set of all zones
    const zoneSet = new Map();
    // TODO: No zoneCode?
    results.forEach((h) => {
      if (!zoneSet.has(h.zoneName)) zoneSet.set(h.zoneName, 1);
      else zoneSet.set(h.zoneName, zoneSet.get(h.zoneName) + 1);
    });
    setZones(Array.from(zoneSet).map(([z, count]): ZoneInfo => ({ code: z, name: z, count })));
  }, [results]);

  // Apply sorting
  useEffect(() => {
    if (!results.length) return;
    switch (sort) {
      case 'suggested':
        setSorted(results);
        break;
      case 'price-low':
        setSorted([...results].sort((a, b) => Number(a.minRate) - Number(b.minRate)));
        break;
      case 'price-high':
        setSorted([...results].sort((a, b) => Number(b.minRate) - Number(a.minRate)));
        break;
      default:
        break;
    }
  }, [results, sort]);

  // Apply filters
  useEffect(() => {
    if (!sorted.length) return;
    let filteredList = sorted;

    // Filter by price
    filteredList = filteredList.filter(
      (hotel) =>
        Number(hotel.minRate) >= priceRange[0] && (!(priceRange[1] < 500) || Number(hotel.minRate) <= priceRange[1]),
    );

    // Filter by zone
    if (zone) filteredList = filteredList.filter((hotel) => hotel.zoneName === zone);

    setFiltered(filteredList);
  }, [sorted, priceRange, zone]);

  useEffect(() => {
    if (!results.length) return;
    if (!loading) setResultsMessage(`Found ${filtered.length} hotel${filtered.length !== 1 ? 's' : ''}`);
  }, [filtered]);

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
      <Stack direction="row" spacing={4} sx={{ pt: 4 }}>
        <Stack sx={{ width: 275, p: 2, pl: 1 }} alignItems="start">
          <PriceSlider loading={loading} priceRange={priceRange} setPriceRange={setPriceRange} />
          {(zones.length > 0 || loading) && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="end" width="100%" height={40}>
                <Typography gutterBottom>Neighborhood</Typography>
                {zone && (
                  <IconButton onClick={() => setZone(null)}>
                    <CloseIcon />
                  </IconButton>
                )}
              </Stack>
              <RadioGroup name="zones" value={zone} onChange={(e, v) => setZone(v)}>
                {zones.map(({ code, name, count }) => (
                  <FormControlLabel
                    value={code}
                    key={code}
                    label={
                      <Typography style={{ fontSize: 14 }}>
                        {name} <small>({count})</small>
                      </Typography>
                    }
                    control={<Radio />}
                  />
                ))}
                {loading && (
                  <>
                    <Skeleton variant="rectangular" height={42} width={250} sx={{ borderRadius: 1, mb: 1 }} />
                    <Skeleton variant="rectangular" height={42} width={250} sx={{ borderRadius: 1, mb: 1 }} />
                    <Skeleton variant="rectangular" height={42} width={250} sx={{ borderRadius: 1, mb: 1 }} />
                  </>
                )}
              </RadioGroup>
            </>
          )}
        </Stack>
        <Stack sx={{ flex: 1, maxWidth: 600, mx: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="end" width="100%">
            <Typography sx={{ flex: 2 }} color="#999">
              {resultsMessage}
            </Typography>
            <Box sx={{ flex: 4, display: 'flex', justifyContent: 'center' }}>
              {loading && results.length > 0 && <Spinner message={false} />}
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={40} width={150} sx={{ flex: 3, borderRadius: 1 }} />
            ) : (
              <FormControl sx={{ flex: 3 }} size="small">
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                  value={sort}
                  disabled={loading}
                  onChange={(e) => setSort(e.target.value as string)}
                  label="Sort by"
                  labelId="sort-by-label"
                >
                  <MenuItem value="suggested">Suggested</MenuItem>
                  <MenuItem value="price-low">Price: low to high</MenuItem>
                  <MenuItem value="price-high">Price: high to low</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
          {loading && results.length === 0 && <Spinner />}
          <Stack spacing={3} mt={2} mb={3}>
            {filtered.length > 0 &&
              filtered.map((hotel) => <HotelCard key={hotel.code} hotel={hotel} onBookNow={onBookNow} />)}
            {loading && (
              <>
                <HotelCardSkeleton />
                <HotelCardSkeleton />
                <HotelCardSkeleton />
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </main>
  );
}
