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
import { ZERO } from '../lib/Constants';
import HeaderMetric from './HeaderMetric';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const first = checkins.slice(-1)[0];

  console.log(checkins);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <Toolbar
        sx={{
          gap: 5
        }}
      >
        <MapTwoToneIcon fontSize="large" titleAccess={t('app.name')} />
        <HeaderMetric
          name={t('time.since_sometime_ago')}
          value={
            first && first.createdAt
              ? format(fromUnixTime(first.createdAt), t('time.date_format'))
              : null
          }
          size="large"
        />
        <HeaderMetric
          name={t('checkins')}
          value={(checkins?.length ?? ZERO).toLocaleString()}
        />
        <HeaderMetric
          name={t('venues')}
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
          getOptionLabel={(option: FoursquareVenue) => {
            return [
              option?.name,
              option?.location?.formattedAddress
                ? option.location.formattedAddress.join(', ')
                : ''
            ].join(': ');
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                size="small"
                fullWidth
                placeholder={t('action.search_venues')}
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
          aria-label={t('settings')}
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
