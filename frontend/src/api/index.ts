import * as fetch from './fetch';
import { User } from './types';

// eslint-disable-next-line import/prefer-default-export
export function getUser() {
  return fetch.get<User>('/user/me');
}
