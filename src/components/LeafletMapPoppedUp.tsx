import React, { useEffect, useMemo } from 'react';
import { Popup, useMap, useMapEvents } from 'react-leaflet';
import type { FoursquareVenueWithCheckins } from '../lib/Types';
import { Typography } from '@mui/material';
import L from 'leaflet';

const GRID_SIZE_OFFSET = 4;

const LeafletMapPoppedUp = ({
  activeVenueWithCheckins,
  onVenueSelected
}: {
  activeVenueWithCheckins: FoursquareVenueWithCheckins;
  onVenueSelected: (venueId: string | null) => void;
}) => {
  const map = useMap();
  const { lat, lng } = useMemo(() => {
    const { lat, lng } = activeVenueWithCheckins.venue.location;
    return {
      lat,
      lng
    };
  }, [activeVenueWithCheckins.venue.location]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mapEvents = useMapEvents({
    popupclose() {
      onVenueSelected(null);
    }
  });

  useEffect(() => {
    if (lat == null || lng == null) {
      return;
    }

    const container = map.getContainer();
    const offset = [
      container.offsetWidth / GRID_SIZE_OFFSET,
      container.offsetHeight / GRID_SIZE_OFFSET
    ];

    const point = map.latLngToContainerPoint(L.latLng([lat, lng]));
    const newPoint = L.point([point.x - offset[0], point.y + offset[1]]);

    map.flyTo(map.containerPointToLatLng(newPoint), map.getZoom());
  }, [lat, lng]);

  return (
    <Popup position={[lat, lng]} minWidth={300} maxHeight={500}>
      <Typography variant="h5">{activeVenueWithCheckins.venue.name}</Typography>
      <Typography variant="subtitle1">
        {activeVenueWithCheckins.venue.location.formattedAddress.join('\n')}
      </Typography>
    </Popup>
  );
};

export default LeafletMapPoppedUp;
