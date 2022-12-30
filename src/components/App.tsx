import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import Platform from './Platform';

const AppConfig = {
  environment: 'development',
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
        <Platform config={AppConfig} />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
