import type { LatLngExpression } from 'leaflet';
import * as React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import type { FoursquareVenue, FoursquareVenueWithCheckins } from './AppTypes';
import MappedPoppedUp from './MappedPoppedUp';
import MappedMarkers from './MappedMarkers';

type Props = {
  venues: Map<string, FoursquareVenue>;
  selectedVenueWithCheckins: FoursquareVenueWithCheckins | null | undefined;
  onVenueSelected: (venueId: string | null) => void;
  origin: LatLngExpression;
  zoom: number;
};

const Mapped = ({
  venues,
  selectedVenueWithCheckins,
  onVenueSelected,
  origin,
  zoom
}: Props) => {
  return (
    <MapContainer
      style={{
        width: 'inherit',
        height: 'inherit'
      }}
      center={origin}
      zoomControl={false}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <MappedMarkers venues={venues} onVenueSelected={onVenueSelected} />
      {selectedVenueWithCheckins && (
        <MappedPoppedUp selectedVenueWithCheckins={selectedVenueWithCheckins} />
      )}
      <TileLayer
        // eslint-disable-next-line max-len
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default Mapped;
