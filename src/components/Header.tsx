import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, Autocomplete, ListItem, TextField} from '@mui/material';
import type { FoursquareVenue } from '../App.types'

type Props = {
  venues: Map<string, FoursquareVenue> | null | undefined,
  onVenueSelected: (venueId: string) => void
}

const Header = ({ venues, onVenueSelected }: Props) => {
  return (
    <AppBar enableColorOnDark color="transparent" position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          4MAPS
        </Typography>
        <Autocomplete
          id="4maps-search"
          blurOnSelect
          clearOnEscape
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event: any, venue: any) => {
            onVenueSelected(venue.id);
            return;
          }}
          options={Array.from(venues.values()).map(item => {
            return {
              id: item.id,
              label: item.name,
              address: item.location.formattedAddress
            }
          })}
          getOptionLabel={option => option.label + ': ' +  option.address}
          renderInput={(params) => {
            return (<TextField {...params} label="Venues"  />)
          }}
          sx={{
            width: '40%'
          }}
        />
      </Toolbar>
    </AppBar>
  )
}

export default Header