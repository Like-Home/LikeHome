import {
  Stack,
  useTheme,
  useMediaQuery,
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
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HotelCard, { HotelCardSkeleton, onBookNowCallback } from '../components/HotelCard';
import SearchBars, { SearchPageParams, onSearchProps } from '../components/SearchBars';
import { getOffersByLocation, OfferHotel } from '../api/search';
import Spinner from '../components/Spinner';
import PriceSlider from '../components/controls/PriceSlider';
import { nightsFromDates, priceBreakdown } from '../api/hotel';
import { usePageParamsObject } from '../hooks';

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
  const [params, setParams] = usePageParamsObject<SearchPageParams>();

  const location = JSON.parse(atob(params.location || ''));
  const [offerHotelsArgs, setOfferHotelsArgs] = useState<setOfferHotelsArgsProps>({
    destinationCode: location?.code,
    checkin: params.checkin,
    checkout: params.checkout,
    guests: Number(params.guests),
    rooms: Number(params.rooms),
  });

  // Data
  const [nights, setNights] = useState(0);
  const [adults, setAdults] = useState(0);
  const [results, setResults] = useState<OfferHotel[]>([]);
  const [sorted, setSorted] = useState<OfferHotel[]>([]);
  const [filtered, setFiltered] = useState<OfferHotel[]>([]);
  const [zones, setZones] = useState<ZoneInfo[]>([]);
  const [resultsMessage, setResultsMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // Sort and filter parameters
  const [priceRangeMax, setPriceRangeMax] = useState(0);
  const [priceRangeMin, setPriceRangeMin] = useState(0);
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

  // update price range based on minRate and maxRate
  useEffect(() => {
    if (!results.length) return;

    const minRates = results.map((h) => priceBreakdown(h.minRate, nights, adults).perNightPerAdult);

    let minRate = Math.min(...minRates);
    // round to nearest 10
    minRate = Math.floor(minRate / 10) * 10;
    let maxRate = Math.max(...minRates);
    // round to nearest 10
    maxRate = Math.ceil(maxRate / 10) * 10;

    setPriceRangeMin(minRate);
    setPriceRangeMax(maxRate);

    setPriceRange([minRate, maxRate]);
  }, [results]);

  function onSearch(kwargs: onSearchProps) {
    // update url params

    if (!kwargs.checkin || !kwargs.checkout || !kwargs.guests || !kwargs.rooms) {
      // TODO: Show error
      return () => {
        /* do nothing */
      };
    }

    // const searchParams = new URLSearchParams();
    // searchParams.set('location', btoa(JSON.stringify(kwargs.location)));
    // searchParams.set('checkin', kwargs.checkin);
    // searchParams.set('checkout', kwargs.checkout);
    // searchParams.set('guests', kwargs.guests);
    // searchParams.set('rooms', kwargs.rooms);
    setParams({
      location: btoa(JSON.stringify(kwargs.location)),
      checkin: kwargs.checkin,
      checkout: kwargs.checkout,
      guests: kwargs.guests,
      rooms: kwargs.rooms,
    });

    setNights(nightsFromDates(new Date(kwargs.checkin), new Date(kwargs.checkout)));
    setAdults(parseInt(kwargs.guests, 10));

    setResultsMessage('Searching...');
    setZones([]);
    setResults([]);
    setSorted([]);
    setFiltered([]);
    setLoading(true);
    setFilterLoading(true);

    const args = {
      destinationCode: kwargs?.location?.code,
      checkin: kwargs.checkin,
      checkout: kwargs.checkout,
      guests: Number(kwargs.guests),
      rooms: Number(kwargs.rooms),
    };

    setOfferHotelsArgs(args);

    let cancel = false;

    // Do an immediate request
    getOffersByLocation({ ...args, size: 5 }).then((response) => {
      if (!cancel) {
        setResults(response.results);
        setResultsMessage(`Found ${response.total} hotel${response.total !== 1 ? 's' : ''}`);
        setLoading(false);
        if (response.links.next) {
          // Do a delayed request
          getOffersByLocation({ ...args, size: 100 }).then((res) => {
            if (cancel) return;
            setFilterLoading(false);
            setResults(res.results);
          });
        }
      }
    });

    return () => {
      cancel = true;
    };
  }

  // Begin search
  useEffect(() => {
    if (pageParamsAreInvalid(offerHotelsArgs)) {
      return () => {
        /* do nothing */
      };
    }
    return onSearch({
      location,
      checkin: params.checkin,
      checkout: params.checkout,
      guests: params.guests,
      rooms: params.rooms,
    });
  }, []);

  if (pageParamsAreInvalid(offerHotelsArgs)) {
    return (
      <main className="card card-root push-center" style={{ marginTop: 50, maxWidth: 1200 }}>
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
    filteredList = filteredList.filter((hotel) => {
      const { perNightPerAdult } = priceBreakdown(hotel.minRate, nights, adults);
      return perNightPerAdult >= priceRange[0] && perNightPerAdult <= priceRange[1];
    });

    // Filter by zone
    if (zone) filteredList = filteredList.filter((hotel) => hotel.zoneName === zone);

    setFiltered(filteredList);
  }, [sorted, priceRange, zone]);

  useEffect(() => {
    if (!results.length) return;
    if (filterLoading) return;
    if (!loading) setResultsMessage(`Found ${filtered.length} hotel${filtered.length !== 1 ? 's' : ''}`);
  }, [filtered, filterLoading]);

  const theme = useTheme();
  const onlyMediumScreens = useMediaQuery(theme.breakpoints.down('md'));

  const filteringOptionsRootEl = (
    <Stack
      alignItems="start"
      direction={{
        xs: 'column',
        sm: 'row',
        md: 'column',
      }}
    >
      <Box width={'100%'}>
        <PriceSlider
          adults={adults}
          loading={filterLoading}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          min={priceRangeMin}
          max={priceRangeMax}
        />
      </Box>
      {(zones.length > 0 || filterLoading) && (
        <Box width={'100%'}>
          <Stack direction="row" justifyContent="space-between" alignItems="end" width="100%" height={40}>
            <Typography gutterBottom>Neighborhood</Typography>
            {zone && (
              <IconButton onClick={() => setZone(null)}>
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
          <RadioGroup name="zones" value={zone} onChange={(e, v) => setZone(v)}>
            {filterLoading ? (
              <>
                <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 1, mb: 1 }} />
                <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 1, mb: 1 }} />
                <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 1, mb: 1 }} />
              </>
            ) : (
              zones.map(({ code, name, count }) => (
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
              ))
            )}
          </RadioGroup>
        </Box>
      )}
    </Stack>
  );

  const sizing = {
    xs: 2,
    sm: 3,
  };
  return (
    <Stack className="card card-root push-center" spacing={sizing}>
      <SearchBars
        location={location}
        guests={params.guests}
        rooms={params.rooms}
        checkin={params.checkin}
        checkout={params.checkout}
        onSearch={onSearch}
      />
      <Stack
        direction={{
          sm: 'column',
          md: 'row',
        }}
        spacing={sizing}
      >
        <Box flex={1}>
          {onlyMediumScreens ? (
            <Accordion sx={{ flex: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>{filteringOptionsRootEl}</AccordionDetails>
            </Accordion>
          ) : (
            filteringOptionsRootEl
          )}
        </Box>
        <Stack sx={{ flex: 2 }} spacing={sizing}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Typography sx={{ flex: 2 }} color="#999">
              {resultsMessage}
            </Typography>
            <Box sx={{ flex: 4, display: 'flex', justifyContent: 'center' }}>
              {loading && results.length > 0 && <Spinner message={false} />}
            </Box>
            {filterLoading ? (
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
          <Stack spacing={sizing}>
            {filtered.length > 0 &&
              filtered.map((hotel) => (
                <HotelCard
                  key={hotel.code}
                  hotel={hotel}
                  onBookNow={onBookNow}
                  stay={{
                    nights,
                    adults,
                  }}
                />
              ))}
            {(loading || filterLoading) && (
              <>
                <HotelCardSkeleton />
                <HotelCardSkeleton />
                <HotelCardSkeleton />
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
