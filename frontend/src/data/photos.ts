// Destinations with photos to use + their attributions
// Images are in static/images/destinations/<code>.jpg
export const photos: { [key: string]: string } = {
  LVS: 'Pixabay',
  NYC: 'Roberto Vivancos',
  ORD: 'Chait Goli',
  SFO: 'Pixabay',
  MCO: 'Craig Adderley',
  MSY: 'Ken Cooper',
  SAD: 'Lucas Fonseca',
  NSV: 'Cesar G',
  LAX: 'Edgar Colomba',
  MIA: 'Valentina Rossoni',
  DEN: 'Colin Lloyd',
  WAS: 'Aaron Kittredge',
  AUS: 'Pixabay',
  ATL: 'Richard Solano',
  SEA: 'Chait Goli',
  YSP: 'Nextvoyage',
};

export function get(code: string) {
  const hasCustomBgImage = code in photos;
  const bgImageAttribution = hasCustomBgImage ? photos[code] : 'Charles Parker';
  const bgImage = hasCustomBgImage ? `/images/destinations/${code}.jpg` : '/images/placeholders/pexels-city.jpg';
  return [bgImage, bgImageAttribution];
}

export default { photos, get };
