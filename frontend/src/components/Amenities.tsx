// @ts-nocheck
/* eslint-disable react/prop-types */

import { Stack, ListItemIcon } from '@mui/material';
import {
  LunchDining as FullBoard,
  AttachMoney as FeeIcon,
  DirectionsBike as Cycling,
  FreeBreakfast as Breakfast,
  FitnessCenter as Fitness,
  Close as CloseIcon,
  GolfCourse as Golf,
  Newspaper as Newspapers,
  LocalLaundryService as Laundry,
  Description as Document,
  DownhillSkiing as Ski,
  Language as Website,
  Park as Garden,
  WbSunny as Sun,
  ContentCut as Scissors,
  Tv,
  Desk,
  SmokingRooms,
  SmokeFree,
  Shower,
  Alarm,
  Rowing,
  MeetingRoom,
  Bed,
  Sailing,
  CoffeeMaker,
  ScubaDiving,
  Games,
  Sledding,
  Translate,
  Kayaking,
  Wifi,
  SportsTennis,
  AccessibleForward,
  Deck,
  Surfing,
  Flight,
  Boy,
  Pool,
  AccessibilityNew,
  Work,
  CoPresent,
  Dining,
  Woman,
  Man,
  HotTub,
  LocalBar,
  LocalMovies,
  Water,
  Badge,
  Spa,
  Check as DefaultFacilityIcon,
} from '@mui/icons-material';

// Some facilities have meaningless numbers
const noNumber = (icon) => (fac) => ({ ...fac, icon, number: null });
const ignore = () => null;
const smoking = (fac) =>
  fac.present ? { ...fac, icon: SmokingRooms } : { ...fac, absentIcon: SmokeFree, name: 'No Smoking' };

const FacilityIcons = {
  'Children share the bed with parents': Bed,
  'Number of bedrooms': (fac) => {
    if (fac.number === 1) return null; // duh
    return { ...fac, icon: MeetingRoom, number: null, facility: `${fac.number} bedrooms` };
  },
  'Pedal boating': Rowing, // close enough
  'Breakfast a la carte': Breakfast,
  '24h dining café': Breakfast,
  'Cycling / mountain biking': noNumber(Cycling),
  'Full board': FullBoard,
  'Poolside snack bar': FullBoard,
  'Smoking rooms': smoking,
  'Smoking area': smoking,
  'Multilingual staff': Translate,
  'Golf practice facility': Golf,
  'Video games console': Games,
  'Wi-fi': Wifi,
  'Table tennis': SportsTennis,
  'Disability-friendly rooms': AccessibleForward,
  'Outdoor freshwater pool': Pool,
  'Clothes dryer': Laundry,
  'Flight information required': Flight,
  'Bellboy service': Boy,
  'Online check-in': Website,
  'Business centre': Work,
  'Sun loungers': Sun,
  'Banquet hall': Dining,
  'Luggage room': Work,
  'Catamaran sailing': Sailing,
  'Conference hostess': Woman,
  'Conference host': Man,
  'Alarm clock': Alarm,
  'Cable TV': Tv,
  'Smoke detector': SmokeFree,
  'Non-smoking establishment': SmokeFree,
  'Tea and coffee making facilities ': CoffeeMaker,
  'Tea and coffee making facilities': CoffeeMaker,
  'Jet ski': Ski,
  'Hairdressing salon': Scissors,
  'Banana boating': Water,
  'Pay movies': LocalMovies,
  'Turndown service': Bed,
  'Minimum check-in age': Badge,
  'Spa centre': Spa,
  Sauna: HotTub,
  Nightclub: LocalBar,
  Sailing: noNumber(Sailing),
  Fitness: noNumber(Fitness),
  Toiletries: Shower,
  Diving: ScubaDiving,
  Projector: CoPresent,
  Aerobics: AccessibilityNew,
  Photocopier: Document,
  Waterskiing: Ski,
  Terrace: Deck,
  Tobogganing: Sledding,
  Canoeing: Kayaking,
  Squash: SportsTennis,
  Desk,
  Golf,
  Newspapers,
  Garden,
  Surfing,
  Laundry,
  Pool,

  // Filter out junk
  'Czeck Republic - Safe Stay': ignore,
  'NH - Feel safe at NH': ignore,
  'Blue Diamond Resorts - Enhanced Health, Safety & Cleanliness Protocols': ignore,
  'Morocco - Tourisme au Maroc post Covid-19': ignore,
  'Colombia - Check in certificado, COVID-19 bioseguro': ignore,
  'Crystal - Hygienic Concept': ignore,
  'Ecuador - Protocolo General para establecimientos de alojamiento turístico': ignore,
  'Louvre - Charte of Commitment': ignore,
  'Rosen - Total Commitment': ignore,
  'Highgate - Be Well. Stay Well.': ignore,
  'RIU - Covid-19 Health Protocol': ignore,
  'Minor - AvaniSHIELD': ignore,
  'Shangri-La – Shangri-La Cares': ignore,
  'WTTC - Safe Travels Stamp': ignore,
  'Green Star Hotel Certificate – Egypt': ignore,
  'Mauritian Standard on Sustainable Tourism': ignore,
  'Hilton LightStay': ignore,
  '': ignore,
};

export default function Amenities({ facility }) {
  let fac = facility;
  const present = fac.indYesOrNo !== false && fac.indLogic !== false;

  if (fac.facilityGroup.code === 91) return null; // Skip COVID info

  let Icon = null;
  const func = FacilityIcons[fac.facility.description];
  if (typeof func === 'function') {
    fac = func({ ...fac, present });
    if (!fac) return null;
    Icon = fac.icon ?? null;
  } else Icon = func;
  if (!fac) return null;

  if (!present) {
    Icon = fac.absentIcon ?? CloseIcon;
  }

  if (!Icon) {
    Icon = fac.indFee ? FeeIcon : DefaultFacilityIcon;
  }

  const name = fac.name ?? fac.facility.description;
  if (!name) return null;

  return (
    <Stack direction="row" key={name} sx={!present ? { opacity: 0.5, order: 1, mb: 1 } : { mb: 1 }}>
      {Icon && (
        <ListItemIcon>
          <Icon color={!present ? 'error' : undefined} />
        </ListItemIcon>
      )}
      <span>{name}</span>
    </Stack>
  );
}
