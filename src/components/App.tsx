import React from 'react';
// import * as dotenv from 'dotenv';
import '../lib/i18n';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { AppProvider } from './AppProvider';
import Viewport from './Viewport';

const MapConfig: {
  latlng: number[];
  zoom: number;
} = {
  // eslint-disable-next-line no-magic-numbers
  latlng: [37.55305, -122.31909],
  zoom: 15
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        maxSnack={5}
        autoHideDuration={1500}
      >
        <AppProvider>
          <Viewport latlng={MapConfig.latlng} zoom={MapConfig.zoom} />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
