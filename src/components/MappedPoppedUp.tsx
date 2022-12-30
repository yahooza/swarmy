import React from 'react';
import { Popup, useMapEvents } from 'react-leaflet';
import type { FoursquareVenueWithCheckins } from '../lib/Types';
import { ZERO } from '../lib/Constants';
import { Card, CardHeader, CardContent } from '@mui/material';
import CheckinsList from './CheckinsList';

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
  const { lat, lng } = activeVenueWithCheckins.venue.location;

  return (
    <Popup position={[lat, lng]} minWidth={300} maxHeight={500}>
      <Card
        sx={{
          mx: -1.5,
          boxShadow: 'none'
        }}
      >
        <CardHeader
          title={activeVenueWithCheckins.venue.name}
          // eslint-disable-next-line max-len
          subheader={activeVenueWithCheckins.venue.location.formattedAddress.join(
            '\n'
          )}
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
          {activeVenueWithCheckins.checkins.length > ZERO && (
            <CheckinsList checkins={activeVenueWithCheckins.checkins} />
          )}
        </CardContent>
      </Card>
    </Popup>
  );
};

export default MappedPoppedUp;
