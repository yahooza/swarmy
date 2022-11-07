import * as React from 'react';
import { SnackbarProvider } from 'notistack';
import App from './App';

import type { QueryParams } from './AppTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppProviders = ({ queryParams }: QueryParams) => {
  return (
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
};

export default AppProviders;
