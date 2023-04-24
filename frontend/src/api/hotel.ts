import * as fetch from './fetch';

export function convertCategoryToRatingProps(categoryDescription: string) {
  const numbers = categoryDescription.match(/\d/);
  const props: {
    value: number;
    precision?: number;
  } = {
    value: 0,
    precision: undefined,
  };

  if (numbers) {
    props.value = parseInt(numbers[0], 10);
  }

  if (categoryDescription.match(/half/i)) {
    props.precision = 0.5;
  }

  return props;
}

export function nightsFromDates(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const msBetween = end.getTime() - start.getTime();
  return Math.round(msBetween / msPerDay);
}

export function priceBreakdown(afterTaxPrice: number, nights: number, adults: number) {
  const beforeTax = afterTaxPrice / 1.1;
  return {
    beforeTax,
    afterTax: afterTaxPrice,
    perNight: beforeTax / nights,
    perNightPerAdult: beforeTax / nights / adults,
  };
}

export function getHotel(hotelId: string) {
  // TODO: define this type
  return fetch.get<object>(`/hotel/${hotelId}/`);
}
