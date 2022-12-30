import * as React from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';

import {
  UserConfig,
  MessageCallback,
  UserConfigUpdateCallback,
  Message,
  ConfigKey,
  MessageKey
} from '../lib/Types';
import {
  STORAGE_USER_CONFIG,
  MILLISECONDS_IN_1_SECOND,
  SECONDS_TO_DISPLAY_ERROR_MSG,
  SECONDS_TO_DISPLAY_SUCCESS_MSG,
  API_TOKEN_NOT_VALID
} from '../lib/Constants';
import Mapper from './Mapper';

const Platform = ({
  config
}: {
  config: Record<string, string | number[] | number>;
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [userConfig, setUserConfig] = useLocalStorage<UserConfig>(
    STORAGE_USER_CONFIG,
    {
      [ConfigKey.Token]: null
    }
  );

  /**
   * LocalStorage stuff.
   * For now, updates only the API token
   */
  const updateUserConfig: UserConfigUpdateCallback = React.useCallback(
    (updates: UserConfig) => {
      setUserConfig((prevState: UserConfig) => {
        return {
          ...prevState,
          ...updates
        };
      });
      sendMessage({
        message: 'Updated preferences successfully!',
        type: MessageKey.Success
      });
      return;
    },
    []
  );

  /**
   * Send a Toast sendMessage to the Viewer
   * @param { message, type }
   * @returns void
   */
  const sendMessage: MessageCallback = React.useCallback(
    ({ message, type }: { message: string; type: Message }) => {
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
    <Mapper
      key={userConfig[ConfigKey.Token] ?? API_TOKEN_NOT_VALID}
      token={userConfig[ConfigKey.Token] ?? undefined}
      sendMessage={sendMessage}
      updateUserConfig={updateUserConfig}
      {...config}
    />
  );
};

export default Platform;
