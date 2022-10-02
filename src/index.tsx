import type { LatLngExpression } from 'leaflet';
import * as React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from "./App";

// TODO: query string parsing

const DEFAULTS = {  
  token: 'FLVROYFL0YF1GXJK1GJHUM2HYIG4MG5IULV50KQUNZB2WBTT',
  origin: [37.553050, -122.319090] as LatLngExpression,
  zoom: 13,
  styles: { 
    width: 'inherit',
    height: 'inherit'
  }
}

// TODO: const params = new URLSearchParams(window.location.search);
const app = document.getElementById("app");
const root = createRoot(app)
root.render(<App {...DEFAULTS} />);
