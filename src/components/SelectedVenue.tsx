import { fromUnixTime, formatISO, format } from 'date-fns'
import * as React from 'react';
import {Card, CardHeader, CardContent, List, ListItem, Typography} from '@mui/material';
import type { FoursquareVenueWithCheckins } from '../App.types'

type Props = {
  venueWithCheckins: FoursquareVenueWithCheckins,
}

const SelectedVenue = ({ venueWithCheckins }: Props) => {
  return (
    <Card sx={{
      mx: -2.5,
      boxShadow: 'none'
    }}>
      <CardHeader title={venueWithCheckins.venue.name} sx={{
        py: 0
      }} />
      <CardContent sx={{
        py: 0 
      }}>
        <List sx={{ width: '100%' }}>
          {venueWithCheckins.checkins.map((checkin) => {
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
  )
}

/**
 * 
    <Box>
      {venueWithCheckins.venue.name}
      <ul>
        {venueWithCheckins.checkins.map((checkin) => {
          const checkinTime = fromUnixTime(checkin.createdAt);
          return (
            <li key={checkin.id}>
              <time dateTime={formatISO(checkinTime)}>
                {format(checkinTime, 'PPpp')}
              </time>
            </li>
          )
        })}
      </ul>
    </Box>
 */

export default SelectedVenue