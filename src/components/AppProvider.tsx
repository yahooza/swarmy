import * as React from 'react';
import { Button } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useLocalStorage } from 'usehooks-ts';
import {
  MILLISECONDS_IN_1_SECOND,
  SECONDS_TO_DISPLAY_ERROR_MSG,
  SECONDS_TO_DISPLAY_SUCCESS_MSG,
  STORAGE_SETTINGS_KEY
} from '../lib/Constants';
import {
  Message,
  MessageKey,
  MessageCallback,
  UserSettings,
  UserSettingsKey,
  UpdateSettingsCallback,
  Languages
} from '../lib/Types';
import { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';

export type AppContextType = {
  environment: string;
  sendMessage: MessageCallback;
  userSettings: UserSettings;
  updateUserSettings: UpdateSettingsCallback;
};

export const AppContext = React.createContext<AppContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const AppProvider: FC<Props> = ({ children }) => {
  const { i18n } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>(
    STORAGE_SETTINGS_KEY,
    {
      [UserSettingsKey.Token]: null,
      [UserSettingsKey.Language]: Languages.ENGLISH,
      [UserSettingsKey.DarkMode]:
        (window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches) ||
        false
    }
  );

  const [environment] = useState<string>(
    location.hostname.toLowerCase() !== 'localhost'
      ? 'production'
      : 'development'
  );

  useEffect(() => {
    i18n.changeLanguage(userSettings[UserSettingsKey.Language]);
  }, [userSettings[UserSettingsKey.Language]]);

  /**
   * LocalStorage stuff.
   * For now, updates only the API token
   */
  const updateUserSettings: UpdateSettingsCallback = React.useCallback(
    (updates: UserSettings) => {
      setUserSettings((prevState: UserSettings) => {
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
        sendMessage,
        userSettings,
        updateUserSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
