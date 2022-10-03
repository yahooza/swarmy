import { fromUnixTime, formatISO, format } from 'date-fns'
import type { FoursquareVenueWithCheckins } from '../App.types'

import {Card, CardHeader, CardContent, List, ListItem, Typography} from '@mui/material';
import * as React from 'react';
import { Popup } from 'react-leaflet';

type Props = {
  selectedVenueWithCheckins: FoursquareVenueWithCheckins,
}

const MappedPoppedUp = ({
  selectedVenueWithCheckins,
}: Props) => { 
  return (
    <Popup 
      position={[selectedVenueWithCheckins.venue.location.lat, selectedVenueWithCheckins.venue.location.lng]}
      minWidth={300}
      maxHeight={500}
    >
      <Card sx={{
        mx: -2.5,
        boxShadow: 'none'
      }}>
        <CardHeader title={selectedVenueWithCheckins.venue.name} sx={{
          py: 0
        }} />
        <CardContent sx={{
          py: 0 
        }}>
          <List sx={{ width: '100%' }}>
            {selectedVenueWithCheckins.checkins.map((checkin) => {
              const checkinTime = fromUnixTime(checkin.createdAt);
              return (
                <ListItem
                  key={checkin.id}
                  disableGutters
                  disablePadding
                  alignItems='flex-start'
                >
                  <time dateTime={formatISO(checkinTime)}>
                    {format(checkinTime, 'PPpp')}
                  </time>
                </ListItem>
              )
            })}
          </List>
        </CardContent>
      </Card>
    </Popup>
  )
}

export default MappedPoppedUp