import type { FoursquareVenue, FoursquareVenueWithCheckins } from '../App.types'
import * as React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import SelectedVenue from './SelectedVenue';

type Props = {
  venues: Map<string, FoursquareVenue>,
  selectedVenueWithCheckins: FoursquareVenueWithCheckins,
  onVenueSelected: (venueId: string | null) => void,
}

const MappedMarkersAndPopups = ({ 
  venues, 
  selectedVenueWithCheckins, 
  onVenueSelected 
}: Props) => { 
  const map = useMap()
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
      {selectedVenueWithCheckins && (
        <Popup 
          position={[selectedVenueWithCheckins.venue.location.lat, selectedVenueWithCheckins.venue.location.lng]}
          eventHandlers={{
            click: () => {
              onVenueSelected(null);
              map.flyTo([
                selectedVenueWithCheckins.venue.location.lat, 
                selectedVenueWithCheckins.venue.location.lat
              ])
              return;
            }
          }}
          minWidth={300}
          maxHeight={500}
        >
          <SelectedVenue venueWithCheckins={selectedVenueWithCheckins} />
        </Popup>
      )}
    </>
  )
}

export default MappedMarkersAndPopups