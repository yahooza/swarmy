import * as React from 'react';
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './components/App';

const app = document.getElementById('app');
const root = createRoot(app);
root.render(
  <SnackbarProvider
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    maxSnack={5}
    autoHideDuration={1500}
  >
    <App />
  </SnackbarProvider>
);
