import * as React from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { debounce } from '@mui/material/utils';
import Locations from '../data/locations';
import { getLocation } from '../api/location';
import TextInput from './controls/TextInput';

// eslint-disable-next-line react/prop-types
export default function LocationAutocomplete({ value, setValue }) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const fetch = React.useMemo(
    () =>
      debounce((query, callback) => {
        getLocation(query).then(callback);
      }, 400),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      return undefined;
    }

    fetch(inputValue, ({ results }) => {
      if (active) {
        let newOptions = [];

        if (results.length > 0) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  // TODO: match the theme, dropping in TextInput doesn't work
  return (
    <Autocomplete
      sx={{ width: '100%' }}
      getOptionLabel={(option) => {
        const loc = Locations.get(option.code);
        if (loc) {
          return `${loc[0]}, ${loc[1]}`;
        }
        return option.name;
      }}
      filterOptions={(x) => x}
      options={value ? [...options, value] : options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextInput
          ref={params.InputProps.ref}
          icon={(props) => <LocationOnIcon {...props} />}
          inputProps={params.inputProps}
          label="Location"
          fullWidth
        />
      )}
      renderOption={(props, option) => {
        // eslint-disable-next-line prefer-const
        let [title, ...subtitle] = option.name.split(' - ');

        subtitle = subtitle.join(' - ');

        const titleParts = parse(title, match(title, inputValue));
        const subtitleParts = parse(subtitle, match(subtitle, inputValue));

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {titleParts.map((part, index) => (
                  <Box key={index} component="span" sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}>
                    {part.text}
                  </Box>
                ))}

                <Typography variant="body2" color="text.secondary">
                  {subtitleParts.map((part, index) => (
                    <Box key={index} component="span" sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}>
                      {part.text}
                    </Box>
                  ))}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
