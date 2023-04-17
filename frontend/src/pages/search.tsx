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
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import CloseIcon from '@mui/icons-material/Close';
import HotelCard, { onBookNowCallback } from '../components/HotelCard';
import SearchBars, { SearchPageParams, onSearchProps } from '../components/SearchBars';
import { getOffersByLocation, OfferHotel } from '../api/search';
import Spinner from '../components/Spinner';
import PriceSlider from '../components/controls/PriceSlider';

type ZoneInfo = {
  code: number | string;
  name: string;
  count: number;
};

export default function SearchPage() {
  const [rawParams] = useSearchParams();
  const params: SearchPageParams = Object.fromEntries([...rawParams]);

  const location = JSON.parse(atob(params.location || ''));

  // Data
  const [results, setResults] = useState<OfferHotel[]>([]);
  const [sorted, setSorted] = useState<OfferHotel[]>([]);
  const [filtered, setFiltered] = useState<OfferHotel[]>([]);
  const [zones, setZones] = useState<ZoneInfo[]>([]);
  const [resultsMessage, setResultsMessage] = useState('');

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
    // console.log(kwargs?.location);

    const response = await getOffersByLocation({
      destinationCode: kwargs?.location?.code,
      checkin: kwargs.checkin,
      checkout: kwargs.checkout,
      guests: Number(kwargs.guests),
      rooms: Number(kwargs.rooms),
      size: 100,
    });

    setResults(response.results);

    // Compute set of all zones
    const zoneSet = new Map();
    // TODO: No zoneCode?
    response.results.forEach((h) => {
      if (!zoneSet.has(h.zoneName)) zoneSet.set(h.zoneName, 1);
      else zoneSet.set(h.zoneName, zoneSet.get(h.zoneName) + 1);
    });
    setZones(Array.from(zoneSet).map(([z, count]): ZoneInfo => ({ code: z, name: z, count })));
  }

  // Begin search
  useEffect(() => {
    setResultsMessage('Searching...');
    onSearch({
      location,
      checkin: params.checkin,
      checkout: params.checkout,
      guests: params.guests,
      rooms: params.rooms,
    });
  }, []);

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
    setResultsMessage(`Found ${filtered.length} hotel${filtered.length !== 1 ? 's' : ''}`);
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
          {results.length > 0 && (
            <>
              <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />
              {zones.length > 0 && (
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
                  </RadioGroup>
                </>
              )}
            </>
          )}
        </Stack>
        <Stack sx={{ maxWidth: 600, mx: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="end" width="100%">
            <Typography sx={{ flex: 2 }} color="#999">
              {resultsMessage}
            </Typography>
            {results.length ? (
              <FormControl sx={{ flex: 1 }} size="small">
                <InputLabel id="sort-by-label">Sort by</InputLabel>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as string)}
                  label="Sort by"
                  labelId="sort-by-label"
                >
                  <MenuItem value="suggested">Suggested</MenuItem>
                  <MenuItem value="price-low">Price: low to high</MenuItem>
                  <MenuItem value="price-high">Price: high to low</MenuItem>
                </Select>
              </FormControl>
            ) : null}
          </Stack>
          <Stack spacing={3} mt={2} mb={3}>
            {filtered.length
              ? filtered.map((hotel) => <HotelCard key={hotel.code} hotel={hotel} onBookNow={onBookNow} />)
              : results.length === 0 && <Spinner />}
          </Stack>
        </Stack>
      </Stack>
    </main>
  );
}
