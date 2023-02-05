import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormHelperText,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useMemo } from 'react';
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

  // Used to validate the unsaved token
  const [tmpToken, setTmpToken] = React.useState<string>(token ?? '');
  const tokenRef = React.useRef<HTMLInputElement>(null);

  const onSave = React.useCallback(() => {
    updateUserSettings({
      [UserSettingsKey.Token]: tokenRef?.current?.value
    });
  }, [updateUserSettings]);

  const onRemove = React.useCallback(() => {
    if (window.confirm(`Are you sure you want to delete this token?`)) {
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
        <DialogTitle>Settings</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 500
          }}
        >
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
            <a href={URL_4SQUARE_API_DOCS} target="_blank">
              here
            </a>
            .
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1.5}>
            <Button type="submit" variant="contained" disabled={!isSavable}>
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => onToggleSettings(false)}
              disabled={!isSavable}
            >
              Cancel
            </Button>
          </Stack>
          <IconButton
            color="error"
            aria-label="delete"
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
