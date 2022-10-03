import type { LatLngExpression } from 'leaflet';
import type { CSSStyles, FoursquareVenue, FoursquareVenueWithCheckins } from '../index.types'
import * as React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MappedPoppedUp from './MappedPoppedUp';
import MappedMarkers from './MappedMarkers';

type Props = {
  venues: Map<string, FoursquareVenue>,
  selectedVenueWithCheckins: FoursquareVenueWithCheckins | null | undefined,
  onVenueSelected: (venueId: string | null) => void,
  origin: LatLngExpression,
  zoom?: number,
  styles: CSSStyles
}

const Mapped = ({ 
  venues, 
  selectedVenueWithCheckins, 
  onVenueSelected, 
  origin, 
  zoom = 13, 
  styles 
}: Props) => { 
  return (
    <MapContainer 
      style={styles} 
      center={origin} 
      zoom={zoom} 
      scrollWheelZoom={false}
    >
      <MappedMarkers 
        venues={venues}
        onVenueSelected={onVenueSelected}
      />
      {selectedVenueWithCheckins && (
        <MappedPoppedUp 
          selectedVenueWithCheckins={selectedVenueWithCheckins} 
        />
      )}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default Mapped