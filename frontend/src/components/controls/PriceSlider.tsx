import { Skeleton, Slider, Typography } from '@mui/material';

export default function PriceSlider({
  priceRange,
  setPriceRange,
  min = 0,
  max = 500,
  loading = false,
  maxIncludesAbove = false,
}: {
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  min?: number;
  max?: number;
  maxIncludesAbove?: boolean;
  loading?: boolean;
}) {
  const maxPostfix = maxIncludesAbove ? '+' : '';
  return (
    <>
      <Typography mb={loading ? 0 : 5} width="100%">
        Price per night
      </Typography>
      {loading ? (
        <Skeleton width={250} height={100} />
      ) : (
        <Slider
          value={priceRange}
          sx={{ ml: 2, mb: 3, maxWidth: 235 }}
          max={max}
          min={min}
          step={priceRange[1] >= 300 ? 100 : 25}
          onChange={(e, v) => Array.isArray(v) && setPriceRange(v)}
          valueLabelDisplay="on"
          valueLabelFormat={(v, i) => (i === 1 && v >= max ? `$${v}${maxPostfix}` : `$${v}`)}
          disableSwap
        />
      )}
    </>
  );
}
