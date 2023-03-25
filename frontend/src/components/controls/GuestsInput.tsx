import React, { useState } from 'react';
import { Box, InputBase, Menu } from '@mui/material';
import { Control } from './Control';
import NumberStepper from './NumberStepper';

// TODO: Can extend this to specify number of guests with each room
export default function GuestsInput({
  guests,
  setGuests,
  rooms,
  setRooms,
}: {
  guests: string;
  setGuests: (guest: string) => void;
  rooms: string;
  setRooms: (room: string) => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = !!anchor;

  return (
    <>
      <Control
        name="guests"
        label="Guests"
        onClick={(e: Event | React.SyntheticEvent) => {
          setAnchor(e.target as HTMLElement);
        }}
      >
        <InputBase
          sx={{ pointerEvents: 'none' }}
          value={`${guests} guest${guests !== '1' ? 's' : ''}, ${rooms} room${rooms !== '1' ? 's' : ''}`}
        />
      </Control>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <Box sx={{ p: 2, pb: 0 }}>
          <NumberStepper
            label="Guests"
            value={Number(guests)}
            onChange={(value: number) => setGuests(String(value))}
            min={1}
            max={15}
          />
          <NumberStepper
            label="Rooms"
            value={Number(rooms)}
            onChange={(value: number) => setRooms(String(value))}
            min={1}
          />
        </Box>
      </Menu>
    </>
  );
}
