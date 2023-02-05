import { Button } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import * as React from 'react';
import { useLocalStorage } from 'usehooks-ts';
import {
  MILLISECONDS_IN_1_SECOND,
  SECONDS_TO_DISPLAY_ERROR_MSG,
  SECONDS_TO_DISPLAY_SUCCESS_MSG,
  STORAGE_SETTINGS_KEY
} from '../lib/Constants';
import {
  Message,
  MessageCallback,
  MessageKey,
  Settings,
  SettingsKey,
  SettingsUpdateCallback
} from '../lib/Types';

export type AppContextType = {
  token: string | null;
  environment: string;
  sendMessage: MessageCallback;
  updateSettings: SettingsUpdateCallback;
};

export const AppContext = React.createContext<AppContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const AppProvider: React.FC<Props> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_SETTINGS_KEY,
    {
      [SettingsKey.Token]: null
    }
  );

  const [environment] = React.useState<string>(
    location.hostname.toLowerCase() !== 'localhost'
      ? 'production'
      : 'development'
  );

  /**
   * LocalStorage stuff.
   * For now, updates only the API token
   */
  const updateSettings: SettingsUpdateCallback = React.useCallback(
    (updates: Settings) => {
      setSettings((prevState: Settings) => {
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
            action: (snackbarId: SnackbarKey) => (
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
    <AppContext.Provider
      value={{
        environment,
        token: settings[SettingsKey.Token],
        sendMessage,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
