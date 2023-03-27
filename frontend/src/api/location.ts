import * as fetch from './fetch';

export type Location = {
  pk: string;
  name: string;
};

export type LocationResults = {
  locations: Location[];
};

// eslint-disable-next-line import/prefer-default-export
export function getLocation(query: string) {
  return fetch.get<LocationResults>(`/search_city/${query}`);
}
