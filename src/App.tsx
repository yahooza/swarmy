import * as React from 'react';
import { LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  origin: LatLngExpression,
  zoom?: number
}

const Map = ({ origin, zoom }: Props) => {
  console.log('leaflet', origin, zoom)
  return (
    <MapContainer style={{ width: 'inherit', height: 'inherit' }} center={origin} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={origin}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map