import type { FoursquareVenue, FoursquareVenueWithCheckins } from '../App.types'
import * as React from 'react';
import { Marker } from 'react-leaflet';

type Props = {
  venues: Map<string, FoursquareVenue>,
  onVenueSelected: (venueId: string | null) => void,
}

const MappedMarkers = ({ 
  venues, 
  onVenueSelected 
}: Props) => { 
  return (
    <>
      {venues && venues.size > 0 && Array.from(venues).map(item => item[1]).map((venue: FoursquareVenue) => {
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
        )
      })}
    </>
  )
}

export default MappedMarkers