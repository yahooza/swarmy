import * as React from 'react';
import { useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useSnackbar } from 'notistack';

// TODO: This might be fetch'ed
import * as AppConfig from '../config.json';

import {
  UserConfig,
  AppMessageCallback,
  UserConfigUpdateCallback,
  AppMessage,
  ConfigKey
} from './AppTypes';
import AppMapper from './AppMapper';
import {
  STORAGE_USER_CONFIG,
  MILLISECONDS_IN_1_SECOND,
  SECONDS_TO_DISPLAY_ERROR_MSG,
  SECONDS_TO_DISPLAY_SUCCESS_MSG
} from './AppConstants';
import { Button } from '@mui/material';

// TODO: Local Storage
//   * token
const App = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [userConfig, setUserConfig] = useLocalStorage<UserConfig>(
    STORAGE_USER_CONFIG,
    {
      [ConfigKey.Token]: null
    }
  );

  /**
   * For now, updates the API token
   */
  const onUserConfigUpdate: UserConfigUpdateCallback = useCallback(
    (updates: UserConfig) => {
      setUserConfig((prevState: UserConfig) => {
        return {
          ...prevState,
          ...updates
        };
      });
      onMessage({
        message: 'Updated preferences successfully!',
        type: 'success'
      });
      return;
    },
    []
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
        case 'success':
          enqueueSnackbar(`${message}`, {
            variant: 'success',
            autoHideDuration:
              SECONDS_TO_DISPLAY_SUCCESS_MSG * MILLISECONDS_IN_1_SECOND
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

  return (
    <AppMapper
      key={userConfig[ConfigKey.Token] ?? ''}
      {...AppConfig}
      token={userConfig[ConfigKey.Token] ?? undefined}
      onMessage={onMessage}
      onUserConfigUpdate={onUserConfigUpdate}
    />
  );
};

export default App;
