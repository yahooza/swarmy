import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Link,
  Stack,
  Switch,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleModalCallback, UserSettingsKey } from '../lib/Types';
import { isValidApiToken } from '../lib/Utils';
import { URL_4SQUARE_API_DOCS } from '../lib/Constants';
import { AppContext, AppContextType } from './AppProvider';

const Settings = ({
  onToggleSettings
}: {
  onToggleSettings: ToggleModalCallback;
}) => {
  const { token, updateUserSettings } = React.useContext(
    AppContext
  ) as AppContextType;
  const { t } = useTranslation();

  // Used to validate the unsaved token
  const [tmpToken, setTmpToken] = React.useState<string>(token ?? '');
  const tokenRef = React.useRef<HTMLInputElement>(null);

  const onSave = React.useCallback(() => {
    updateUserSettings({
      [UserSettingsKey.Token]: tokenRef?.current?.value
    });
  }, [updateUserSettings]);

  const onRemove = React.useCallback(() => {
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
    <Dialog onClose={() => onToggleSettings(false)} open={true}>
      <form onSubmit={onSave}>
        <DialogTitle>{t('settings')}</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 500
          }}
        >
          <Stack
            direction="column"
            spacing={4}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            <Box>
              <TextField
                autoComplete="off"
                label="Token"
                variant="standard"
                defaultValue={token ?? ''}
                inputRef={tokenRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setTmpToken((event.target as HTMLInputElement).value)
                }
                sx={{
                  width: '100%'
                }}
              />
              <FormHelperText>
                Register a Foursquare API token{' '}
                <Link
                  href={URL_4SQUARE_API_DOCS}
                  color="inherit"
                  target="_blank"
                >
                  here
                </Link>
                .
              </FormHelperText>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1.5}>
            <Button type="submit" variant="contained" disabled={!isSavable}>
              {t('action.save')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => onToggleSettings(false)}
              disabled={!isSavable}
            >
              {t('action.cancel')}
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
