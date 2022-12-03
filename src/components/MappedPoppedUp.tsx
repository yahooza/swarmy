import * as React from 'react';
import { Popup, useMapEvents } from 'react-leaflet';
import { fromUnixTime, formatISO, format } from 'date-fns';
import type { FoursquareVenueWithCheckins } from './AppTypes';

import { Card, CardHeader, CardContent, List, ListItem } from '@mui/material';

const MappedPoppedUp = ({
  activeVenueWithCheckins,
  onVenueSelected
}: {
  activeVenueWithCheckins: FoursquareVenueWithCheckins;
  onVenueSelected: (venueId: string | null) => void;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const map = useMapEvents({
    popupclose() {
      onVenueSelected(null);
    }
  });

  /*
  // Photos
  const photos = React.useMemo(() => {
    return activeVenueWithCheckins.checkins
      .map(checkin => checkin.photos?.items ?? null)
      .filter(item => item !== null)
  }, [activeVenueWithCheckins])
  */

  return (
    <Popup
      position={[
        activeVenueWithCheckins.venue.location.lat,
        activeVenueWithCheckins.venue.location.lng
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
          title={activeVenueWithCheckins.venue.name}
          subheader={activeVenueWithCheckins.venue.location.formattedAddress}
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
            {activeVenueWithCheckins.checkins.map((checkin) => {
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
