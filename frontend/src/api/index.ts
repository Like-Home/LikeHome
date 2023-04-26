import * as fetch from './fetch';
import { User, UserPutArgs } from './types';

// eslint-disable-next-line import/prefer-default-export
export function getUser() {
  return fetch.get<User>('/user/me/');
}

export function putUser(newDetails: Partial<UserPutArgs>) {
  return fetch.put<Partial<UserPutArgs>, User>('/user/me/', newDetails);
}
