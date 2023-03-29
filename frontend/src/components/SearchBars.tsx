import { ChangeEvent, useState } from 'react';
import { Stack, Button } from '@mui/material';
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
    pk: string;
    name: string;
  };
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
};

type SearchBarProps = SearchPageParams & {
  location?: {
    pk: string;
    name: string;
  };
  noLocation?: boolean;
  onSearch?: (props: onSearchProps) => void;
};

/**
 * Renders the hotel search bar
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
    <Form method="get">
      <Stack direction="row" justifyContent="center" spacing={2} m={1}>
        {!props.noLocation && <LocationAutocomplete value={location} setValue={setLocation} />}
        <TextInput
          name="date"
          type="date"
          label="Check-in Date"
          value={checkin}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckin(e.target.value)}
        />
        <TextInput
          name="date"
          type="date"
          label="Checkout Date"
          value={checkout}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.value)}
        />
        <GuestsInput guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms} />
        <Button
          sx={{ px: 5, fontSize: 20 }}
          onClick={() => {
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
      </Stack>
    </Form>
  );
}
