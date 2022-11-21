import * as React from 'react';
import { Marker } from 'react-leaflet';
import type { FoursquareVenue } from './AppTypes';
import { INDEX_OF_VENUE, VALID_NUMBER_OF_VENUES } from './AppConstants';

type Props = {
  venues: Map<string, FoursquareVenue>;
  onVenueSelected: (venueId: string | null) => void;
};

const MappedMarkers = ({ venues, onVenueSelected }: Props) => {
  return (
    <>
      {venues &&
        venues.size >= VALID_NUMBER_OF_VENUES &&
        Array.from(venues)
          .map((item) => item[INDEX_OF_VENUE])
          .map((venue: FoursquareVenue) => {
            return (
              <Marker
                title={venue.name}
                key={venue.id}
                position={[venue.location.lat, venue.location.lng]}
                eventHandlers={{
                  click: () => {
                    onVenueSelected(venue.id);
                    return;
                  }
                }}
              >
                {venue.name}
              </Marker>
            );
          })}
    </>
  );
};

export default MappedMarkers;
