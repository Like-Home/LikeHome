import { Box, InputBase, Menu } from '@mui/material';
import { useState } from 'react';
import { Control } from './Control';
import NumberStepper from './NumberStepper';

// TODO: Can extend this to specify number of guests with each room
export default function GuestsInput() {
  const [anchor, setAnchor] = useState(null);
  const open = !!anchor;

  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  return (
    <>
      <Control
        name="guests"
        label="Guests"
        onClick={(e: any) => {
          setAnchor(e.target);
        }}
      >
        <InputBase
          sx={{ pointerEvents: 'none' }}
          value={`${guests} guest${guests !== 1 ? 's' : ''}, ${rooms} room${rooms !== 1 ? 's' : ''}`}
        />
      </Control>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <Box sx={{ p: 2, pb: 0 }}>
          <NumberStepper label="Guests" value={guests} onChange={setGuests} min={1} max={15} />
          <NumberStepper label="Rooms" value={rooms} onChange={setRooms} min={1} />
        </Box>
      </Menu>
    </>
  );
}
