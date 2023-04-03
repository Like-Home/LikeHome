import { selectorFamily } from 'recoil';
import { getCheckoutDetails } from '../../api/checkout';

// eslint-disable-next-line import/prefer-default-export
export const checkoutDetails = selectorFamily({
  key: 'checkoutDetailsByRateKey',
  get: (rateKey: string) => () => getCheckoutDetails(rateKey),
});
