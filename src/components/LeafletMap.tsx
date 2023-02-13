import type { LatLngExpression } from 'leaflet';
import * as React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import type {
  FoursquareVenue,
  FoursquareVenueWithCheckins
} from '../lib/Types';
import LeafletMapMarkers from './LeafletMapMarkers';

const LeafletMap = ({
  venues,
  onVenueSelected,
  origin,
  zoom
}: {
  venues: Map<string, FoursquareVenue>;
  activeVenueWithCheckins: FoursquareVenueWithCheckins | null | undefined;
  onVenueSelected: (venueId: string | null) => void;
  origin: number[];
  zoom: number;
}) => {
  return (
    <MapContainer
      style={{
        width: 'inherit',
        height: 'inherit'
      }}
      center={origin as LatLngExpression}
      zoomControl={false}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <LeafletMapMarkers venues={venues} onVenueSelected={onVenueSelected} />
      <TileLayer
        // eslint-disable-next-line max-len
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default LeafletMap;
