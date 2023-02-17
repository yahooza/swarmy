import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  Link,
  Switch,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, {
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Languages,
  ToggleModalCallback,
  UserSettings,
  UserSettingsKey
} from '../lib/Types';
import { isValidApiToken } from '../lib/Utils';
import { URL_4SQUARE_API_DOCS } from '../lib/Constants';
import { AppContext, AppContextType } from './AppProvider';

const Settings = ({
  onToggleSettings
}: {
  onToggleSettings: ToggleModalCallback;
}) => {
  const { token, userSettings, updateUserSettings } = useContext(
    AppContext
  ) as AppContextType;
  const { t } = useTranslation();

  console.log('userSettings', userSettings);

  // Used to validate the unsaved token
  const [tmpToken, setTmpToken] = useState<string>(token ?? '');
  const tokenRef = useRef<HTMLInputElement>(null);

  const saveUserSettings = useCallback(
    (updates: UserSettings): void => {
      updateUserSettings({
        ...updates
      });
    },
    [updateUserSettings]
  );

  const onRemove = useCallback(() => {
    if (window.confirm(t('question.delete_token'))) {
      updateUserSettings({
        [UserSettingsKey.Token]: null
      });
      setTmpToken('');
    }
  }, [updateUserSettings]);

  const isSavable = useMemo(
    () => isValidApiToken({ token: tmpToken }),
    [tmpToken]
  );

  return (
    <Dialog
      fullWidth={true}
      maxWidth="lg"
      onClose={() => onToggleSettings(false)}
      open={true}
    >
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          saveUserSettings({
            [UserSettingsKey.Token]: tokenRef?.current?.value
          });
        }}
      >
        <DialogTitle>{t('settings')}</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 500
          }}
        >
          <Grid container spacing={5}>
            <Grid item xs={12} lg={6}>
              <Typography variant="h5">{t('api_access')}</Typography>
              <TextField
                label={t('token')}
                autoComplete="off"
                variant="outlined"
                defaultValue={token ?? ''}
                inputRef={tokenRef}
                color={isSavable ? 'success' : 'warning'}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setTmpToken((event.target as HTMLInputElement).value)
                }
                placeholder="API Token"
                fullWidth
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isSavable}
                      sx={{
                        ml: 3
                      }}
                    >
                      {t('action.save')}
                    </Button>
                  )
                }}
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Register a Foursquare API token{' '}
                <Link
                  href={URL_4SQUARE_API_DOCS}
                  color="inherit"
                  target="_blank"
                >
                  here
                </Link>
                .
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography variant="h5">{t('appearance')}</Typography>
              <FormControl>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  {t('preferred_langauge')}
                </Typography>
                <RadioGroup
                  aria-labelledby="settings-language"
                  value={userSettings[UserSettingsKey.Language]}
                  name="settings-language"
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => {
                    saveUserSettings({
                      [UserSettingsKey.Language]: (
                        event.target as HTMLInputElement
                      ).value as Languages
                    });
                  }}
                  sx={{ mt: 2 }}
                >
                  <FormControlLabel
                    value={Languages.ENGLISH}
                    control={<Radio />}
                    label={t('languages.english')}
                  />
                  <FormControlLabel
                    value={Languages.GERMAN}
                    control={<Radio />}
                    label={t('languages.german')}
                  />
                  <FormControlLabel
                    value={Languages.THAI}
                    control={<Radio />}
                    label={t('languages.thai')}
                  />
                </RadioGroup>
              </FormControl>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {t('dark_mode')}
              </Typography>
              <FormGroup sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userSettings[UserSettingsKey.DarkMode] === true}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        saveUserSettings({
                          [UserSettingsKey.DarkMode]: event.target.checked
                        });
                      }}
                    />
                  }
                  label=""
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              onClick={() => onToggleSettings(false)}
              disabled={!isSavable}
            >
              {t('action.close')}
            </Button>
          </Stack>
          <IconButton
            color="error"
            aria-label={t('action.delete')}
            onClick={onRemove}
            disabled={tmpToken.length < 1}
          >
            <DeleteIcon />
          </IconButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Settings;
