import { LatLngExpression } from 'leaflet';
import * as React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from "./App";

const DEFAULTS = {
  props: {
    origin: [37.553050, -122.319090] as LatLngExpression,
    zoom: 13
  }
}

const app = document.getElementById("app");
const root = createRoot(app)
root.render(<App {...DEFAULTS.props} />);
