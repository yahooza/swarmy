import * as React from 'react';
import { Popup } from 'react-leaflet';
import { fromUnixTime, formatISO, format } from 'date-fns';
import type { FoursquareVenueWithCheckins } from './AppTypes';

import { Card, CardHeader, CardContent, List, ListItem } from '@mui/material';

type Props = {
  selectedVenueWithCheckins: FoursquareVenueWithCheckins;
};

const MappedPoppedUp = ({ selectedVenueWithCheckins }: Props) => {
  /*
  // Photos
  const photos = React.useMemo(() => {
    return selectedVenueWithCheckins.checkins
      .map(checkin => checkin.photos?.items ?? null)
      .filter(item => item !== null)
  }, [selectedVenueWithCheckins])
  */
  return (
    <Popup
      position={[
        selectedVenueWithCheckins.venue.location.lat,
        selectedVenueWithCheckins.venue.location.lng
      ]}
      minWidth={300}
      maxHeight={500}
    >
      <Card
        sx={{
          mx: -2.5,
          boxShadow: 'none'
        }}
      >
        <CardHeader
          title={selectedVenueWithCheckins.venue.name}
          subheader={selectedVenueWithCheckins.venue.location.formattedAddress}
          subheaderTypographyProps={{
            sx: {
              lineHeight: 'initial'
            }
          }}
          sx={{
            py: 0
          }}
        />
        <CardContent
          sx={{
            py: 0
          }}
        >
          <List sx={{ width: '100%' }}>
            {selectedVenueWithCheckins.checkins.map((checkin) => {
              const checkinTime = fromUnixTime(checkin.createdAt);
              return (
                <ListItem
                  key={checkin.id}
                  disableGutters
                  disablePadding
                  alignItems="flex-start"
                >
                  <time dateTime={formatISO(checkinTime)}>
                    {format(checkinTime, 'PPpp')}
                  </time>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Popup>
  );
};

export default MappedPoppedUp;
