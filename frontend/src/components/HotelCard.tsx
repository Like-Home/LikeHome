import { Box, Stack } from '@mui/material';

export default function HotelCard() {
  return (
    <div className="card" style={{ display: 'flex', padding: 0, maxHeight: 200 }}>
      <img src="/images/placeholders/hotel.png" style={{ height: 200 }} alt="" />
      <Box mx={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <h2 style={{ marginBottom: -8, marginTop: 16 }}>Hotel Name</h2>
          <h2 style={{ marginBottom: -8, marginTop: 16 }}>$60</h2>
        </Stack>
        <small style={{ opacity: 0.5 }}>Location</small>
        <p style={{ marginTop: 10, fontSize: 14 }}>
          {`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De...`}
        </p>
      </Box>
    </div>
  );
}
