import * as React from 'react';
import { fromUnixTime, format } from 'date-fns';
import {
  AppBar,
  Button,
  Autocomplete,
  TextField,
  Toolbar
} from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { FoursquareCheckin, FoursquareVenue } from './AppTypes';
import { HUMAN_READABLE_DATE_FORMAT, ZERO } from './AppConstants';
import Metric from './Metric';

const Header = ({
  venues,
  activeVenue,
  onVenueSelected,
  checkins
}: {
  venues: Map<string, FoursquareVenue> | null | undefined;
  activeVenue: FoursquareVenue | null | undefined;
  onVenueSelected: (venueId: string) => void;
  checkins: FoursquareCheckin[];
}) => {
  const first = [...checkins].pop();

  return (
    <AppBar
      enableColorOnDark
      color="transparent"
      position="fixed"
      sx={{ width: '70%' }}
    >
      <Toolbar
        sx={{
          gap: 4
        }}
      >
        <Metric
          name="Since"
          value={
            first && first.createdAt
              ? format(
                  fromUnixTime(first.createdAt),
                  HUMAN_READABLE_DATE_FORMAT
                )
              : null
          }
          size="large"
        />
        <Metric
          name="Checkins"
          value={(checkins?.length ?? ZERO).toLocaleString()}
        />
        <Metric name="Venues" value={(venues?.size ?? ZERO).toLocaleString()} />
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
          variant="contained"
          aria-label="Settings"
          sx={{
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
