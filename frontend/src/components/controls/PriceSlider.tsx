import { Box, Stack, Skeleton, Slider, Typography } from '@mui/material';
import { formatCurrency } from '../../utils';

export default function PriceSlider({
  priceRange,
  setPriceRange,
  min = 0,
  max = 500,
  loading = false,
  maxIncludesAbove = false,
  adults = 1,
}: {
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  min?: number;
  max?: number;
  maxIncludesAbove?: boolean;
  loading?: boolean;
  adults?: number;
}) {
  const maxPostfix = maxIncludesAbove ? '+' : '';
  return (
    <Stack alignItems={'center'}>
      <Typography width="100%" mb={loading ? 0 : 5}>
        Price per night
      </Typography>
      {loading ? (
        <Skeleton width="70%" height={100} />
      ) : (
        <>
          <Box sx={{ width: '70%' }}>
            <Slider
              value={priceRange}
              max={max}
              min={min}
              step={10}
              onChange={(e, v) => Array.isArray(v) && setPriceRange(v)}
              valueLabelDisplay="on"
              valueLabelFormat={(v, i) =>
                i === 1 && v >= max
                  ? `${formatCurrency(v * adults, false)}${maxPostfix}`
                  : `${formatCurrency(v * adults, false)}`
              }
              disableSwap
            />
          </Box>
          {adults > 1 && (
            <Typography variant="caption" color="lightgray" sx={{ mx: 'auto' }}>
              for {adults} adults
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
}
