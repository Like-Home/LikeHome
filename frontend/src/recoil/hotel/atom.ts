import { selectorFamily } from 'recoil';
import { getHotel } from '../../api/hotel';

// eslint-disable-next-line import/prefer-default-export
export const hotelById = selectorFamily({
  key: 'hotelByIdQuery',
  get: (id: string) => () => getHotel(id),
});
