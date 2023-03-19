import { atom, selector } from 'recoil';
import { getUser } from '../../api';

/**
 * Populate the default selector return value with a service call.
 */
export const userAtomDefault = selector({
  key: 'userDefault',
  get: () => getUser().catch(() => null),
});

/**
 * This is the atom the UI components will use to display state.
 */
export default atom({
  key: 'user',
  default: userAtomDefault,
});
