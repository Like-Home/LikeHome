import { ChangeEvent, useState } from 'react';
import { Stack, Button, Grid } from '@mui/material';
import { useNavigate, Form } from 'react-router-dom';

import TextInput from './controls/TextInput';
import GuestsInput from './controls/GuestsInput';
import LocationAutocomplete from './LocationAutocomplete';

export type SearchPageParams = {
  location?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
};

export type onSearchProps = {
  location?: {
    code: string;
    name: string;
  };
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
};

type SearchBarProps = SearchPageParams & {
  location?: {
    code: string;
    name: string;
  };
  noLocation?: boolean;
  onSearch?: (props: onSearchProps) => void;
};

/**
 * Renders the hotel search bars
 * @param query
 * @param onSearch redirect to /search if not set
 * @returns
 */
export default function SearchBars(props: SearchPageParams & SearchBarProps) {
  const navigate = useNavigate();

  const [location, setLocation] = useState(props.location);
  const [checkin, setCheckin] = useState(props.checkin);
  const [checkout, setCheckout] = useState(props.checkout);
  const [guests, setGuests] = useState(props.guests || '1');
  const [rooms, setRooms] = useState(props.rooms || '1');

  return (
    <Grid container spacing={1}>
      {!props.noLocation && (
        <Grid item xs={24} sm={4} md={3}>
          <LocationAutocomplete value={location} setValue={setLocation} />
        </Grid>
      )}
      <Grid item xs={12} sm={4} md={2}>
        <Stack justifyContent="center">
          <TextInput
            name="date"
            type="date"
            label="Check-in Date"
            value={checkin}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
            sx={{
              height: '100%',
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4} md={2}>
        <Stack justifyContent="center">
          <TextInput
            name="date"
            type="date"
            label="Checkout Date"
            value={checkout}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
            sx={{
              height: '100%',
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GuestsInput guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms} />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Button
          sx={{ fontSize: 20, width: '100%', height: '100%' }}
          onClick={() => {
            if (!location || !checkin || !checkout) {
              // TODO: Alert
              return;
            }
            if (props.onSearch) {
              props.onSearch({
                location,
                checkin,
                checkout,
                guests,
                rooms,
              });
            } else {
              // TODO: kidna hacky to pass this in the URL. Any ides?
              const locationHash = btoa(JSON.stringify(location));
              // TODO: validate dates before proceeding
              navigate(
                `/search?location=${locationHash}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&rooms=${rooms}`,
              );
            }
          }}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}
