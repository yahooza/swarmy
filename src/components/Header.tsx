import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Autocomplete,
  TextField
} from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { FoursquareVenue } from './AppTypes';

type Props = {
  venues: Map<string, FoursquareVenue> | null | undefined;
  activeVenue: FoursquareVenue | null | undefined;
  onVenueSelected: (venueId: string) => void;
};

const Header = ({ venues, activeVenue, onVenueSelected }: Props) => {
  return (
    <AppBar
      enableColorOnDark
      color="transparent"
      position="fixed"
      sx={{ width: '40%' }}
    >
      <Toolbar
        sx={{
          gap: 1
        }}
      >
        <Autocomplete
          id="4maps-search"
          blurOnSelect
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(
            _: React.ChangeEvent<HTMLInputElement>,
            venue: FoursquareVenue
          ) => {
            onVenueSelected(venue?.id ?? null);
            return;
          }}
          options={Array.from(venues.values())}
          value={activeVenue ?? null}
          getOptionLabel={(option: FoursquareVenue) =>
            [option.name, option.location.formattedAddress].join(', ')
          }
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                fullWidth
                size="small"
                /*
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }} 
                */
              />
            );
          }}
          sx={{
            flexGrow: 1
          }}
        />
        <Button
          color="primary"
          size="large"
          variant="outlined"
          aria-label="Settings"
          sx={{
            paddingX: 1,
            minWidth: 'initial'
          }}
        >
          <SettingsOutlinedIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
