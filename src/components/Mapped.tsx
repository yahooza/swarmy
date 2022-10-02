import type { LatLngExpression } from 'leaflet';
import type { CSSStyles, FoursquareVenue, FoursquareVenueWithCheckins } from '../App.types'
import * as React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MappedMarkersAndPopups from './MappedMarkersAndPopups';

type Props = {
  venues: Map<string, FoursquareVenue>,
  selectedVenueWithCheckins: FoursquareVenueWithCheckins,
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
      <>
        <MappedMarkersAndPopups 
          venues={venues}
          selectedVenueWithCheckins={selectedVenueWithCheckins}
          onVenueSelected={onVenueSelected}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </>
    </MapContainer>
  )
}

export default Mapped