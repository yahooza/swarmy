import * as React from 'react';
import { fromUnixTime, format } from 'date-fns';
import {
  AppBar,
  Button,
  Autocomplete,
  TextField,
  Toolbar,
  InputAdornment
} from '@mui/material';
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type {
  FoursquareCheckin,
  FoursquareVenue,
  ToggleModalCallback
} from '../lib/Types';
import { HUMAN_READABLE_DATE_FORMAT, ZERO } from '../lib/Constants';
import HeaderMetric from './HeaderMetric';

const Header = ({
  checkins,
  venues,
  activeVenue,
  onVenueSelected,
  onToggleSettings
}: {
  checkins: FoursquareCheckin[];
  venues: Map<string, FoursquareVenue> | null | undefined;
  activeVenue: FoursquareVenue | null | undefined;
  onVenueSelected: (venueId: string) => void;
  onToggleSettings: ToggleModalCallback;
}) => {
  const first = [...checkins].pop();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <Toolbar
        sx={{
          gap: 5
        }}
      >
        <MapTwoToneIcon fontSize="large" titleAccess="Four Maps" />
        <HeaderMetric
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
        <HeaderMetric
          name="Checkins"
          value={(checkins?.length ?? ZERO).toLocaleString()}
        />
        <HeaderMetric
          name="Venues"
          value={(venues?.size ?? ZERO).toLocaleString()}
        />
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
                size="small"
                fullWidth
                placeholder="Search venues"
                inputProps={{
                  ...params.inputProps,
                  sx: {
                    color: '#fff'
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            );
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#fff',
            flexGrow: 1,
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        />
        <Button
          color="secondary"
          size="large"
          variant="contained"
          aria-label="Settings"
          sx={{
            minWidth: 'initial'
          }}
          onClick={() => onToggleSettings()}
        >
          <SettingsOutlinedIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
