import * as fetch from './fetch';
import { PaginationResponse } from './types';

export type Location = {
  pk: string;
  name: string;
};

export type LocationResponse = PaginationResponse<Location>;

// eslint-disable-next-line import/prefer-default-export
export function getLocation(query: string) {
  return fetch.get<LocationResponse>(`/destination/search/?q=${query}`);
}
