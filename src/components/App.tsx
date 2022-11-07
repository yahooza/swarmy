import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

// TODO: This might be fetch'ed
import * as config from '../config.json';
import AppMapper from './AppMapper';
import type {
  AppConfig,
  AppConfigKey,
  AppConfigValue,
  AppMessageCallback,
  AppConfigUpdateCallback,
  AppMessage,
  QueryParams
} from './AppTypes';
import {
  MILLISECONDS_IN_1_SECOND,
  SECONDS_TO_DISPLAY_ERROR_MSG
} from './AppConstants';
import { Button } from '@mui/material';

// TODO: Local Storage
//   * token
const App = ({ queryParams }: { queryParams?: QueryParams }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [appState, setAppState] = useState<{
    config: AppConfig;
    queryParams: QueryParams;
  }>({
    config: undefined,
    queryParams: undefined
  });

  useEffect(() => {
    setAppState({ config, queryParams });
  }, [config, queryParams]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onConfigUpdate: AppConfigUpdateCallback = useCallback(
    (key: AppConfigKey, value: AppConfigValue) => {
      setAppState((prevState) => {
        return {
          ...prevState,
          config: {
            ...prevState.config,
            [key]: value
          }
        };
      });
      return;
    },
    [config]
  );

  /**
   * Send a Toast message to the Viewer
   * @param { message, type }
   * @returns
   */
  const onMessage: AppMessageCallback = useCallback(
    ({ message, type }: { message: string; type: AppMessage }) => {
      switch (type) {
        case 'error':
        case 'warning':
          enqueueSnackbar(`Oops: ${message}`, {
            variant: type,
            autoHideDuration:
              SECONDS_TO_DISPLAY_ERROR_MSG * MILLISECONDS_IN_1_SECOND,
            action: (snackbarId) => (
              <Button
                variant="contained"
                color="error"
                onClick={() => closeSnackbar(snackbarId)}
              >
                Dismiss
              </Button>
            )
          });
          return;
        default:
          enqueueSnackbar(`${message}`, {
            variant: 'info'
          });
          return;
      }
    },
    []
  );

  if (!appState.config) {
    return null;
  }
  return <AppMapper {...appState.config} onMessage={onMessage} />;
};

export default App;
