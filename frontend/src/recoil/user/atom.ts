import { atom, selector } from 'recoil';

export interface User {
  username: string;
  email: string;
}

/**
 * Populate the default selector return value with a service call.
 */
export const userAtomDefault = selector<User>({
  key: 'userDefault',
  get: () => fetch('/api/user/me').then((response) => (response.status === 200 ? response.json() : null)),
});

/**
 * This is the atom the UI components will use to display state.
 */
export default atom<User>({
  key: 'user',
  default: userAtomDefault,
});
