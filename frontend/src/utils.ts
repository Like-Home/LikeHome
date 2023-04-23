import { HotelbedsHotel } from './api/types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export function createHotelbedsSrcSetFromPath(path: string) {
  const baseImageUrl = 'https://photos.hotelbeds.com/giata/';
  const imageSizes = [
    { width: 320, suffix: '' },
    { width: 74, suffix: 'small/' },
    { width: 117, suffix: 'medium/' },
    { width: 800, suffix: 'bigger/' },
    // not all hotels support these sizes
    // { width: 1024, suffix: 'xl/' },
    // { width: 2048, suffix: 'xxl/' },
  ];

  const srcset = imageSizes
    .map((size) => {
      const url = `${baseImageUrl}${size.suffix}${path}`;
      return `${url} ${size.width}w`;
    })
    .join(', ');

  return {
    src: `${baseImageUrl}${path}`,
    srcSet: srcset,
  };
}

export function formatAddressFromHotel(hotel: HotelbedsHotel) {
  return `${hotel.address}, ${hotel.city} ${hotel.stateCode} ${hotel.postalCode}`;
}
