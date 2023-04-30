type Dict = { [key: string]: any };

export const codes: Dict = {
  // Format: code: [city, state, linkName]
  LVS: ['Las Vegas', 'NV'],
  NYC: ['New York', 'NY'],
  ORD: ['Chicago', 'IL'],
  MCO: ['Orlando', 'FL'],
  MSY: ['New Orleans', 'LA'],
  SAD: ['San Diego', 'CA'],
  NSV: ['Nashville', 'TN'],
  SFO: ['San Francisco', 'CA'],
  LAX: ['Los Angeles', 'CA'],
  MIA: ['Miami', 'FL'],
  DEN: ['Denver', 'CO'],
  WAS: ['Washington', 'DC'],
  AUS: ['Austin', 'TX'],
  ATL: ['Atlanta', 'GA'],
  SAA: ['San Antonio', 'TX'],
  BOS: ['Boston', 'MA'],
  ACY: ['Atlantic City', 'NJ'],
  YSP: ['Florida Keys', 'FL', 'Key West'],
  VIR: ['Virginia Beach', 'VA'],
  SEA: ['Seattle', 'WA'],
  DFW: ['Dallas', 'TX'],
};

export function get(code: string): string[] {
  return codes[code];
}

export default { codes, get };
