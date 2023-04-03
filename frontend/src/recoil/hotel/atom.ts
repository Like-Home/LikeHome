import { selectorFamily } from 'recoil';
import { getHotel } from '../../api/hotel';
import { getOffersByHotel, OffersByHotel } from '../../api/search';

export const hotelById = selectorFamily({
  key: 'hotelByIdQuery',
  get: (id: string) => () => getHotel(id),
});

export const hotelOffersById = selectorFamily({
  key: 'hotelByIdQuery',
  get: (kwargs: OffersByHotel) => () => getOffersByHotel(kwargs),
});
