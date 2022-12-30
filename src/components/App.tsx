import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import * as AppConfig from '../config.json';
import Platform from './Platform';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
