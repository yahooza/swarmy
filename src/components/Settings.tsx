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
import React from 'react';
import {
  ConfigKey,
  ToggleModalCallback,
  UserConfigUpdateCallback
} from '../lib/Types';
import { isValidApiToken } from '../lib/Utils';
import { URL_4SQUARE_API_DOCS } from '../lib/Constants';

const Settings = ({
  token,
  onToggleSettings,
  updateUserConfig
}: {
  token?: string | null;
  onToggleSettings: ToggleModalCallback;
  updateUserConfig: UserConfigUpdateCallback;
}) => {
  const [localToken, setLocalToken] = React.useState<string | null>(
    token ?? null
  );
  const tokenRef = React.useRef<HTMLInputElement>(null);

  const onSave = React.useCallback(() => {
    updateUserConfig({
      [ConfigKey.Token]: tokenRef?.current?.value
    });
  }, [updateUserConfig]);

  const onRemove = React.useCallback(() => {
    if (window.confirm(`Are you sure you want to delete this token?`)) {
      updateUserConfig({
        [ConfigKey.Token]: null
      });
    }
  }, [updateUserConfig]);

  const isSavable = React.useMemo(
    () => isValidApiToken({ token: localToken }),
    [localToken]
  );

  return (
    <Dialog onClose={() => onToggleSettings(false)} open={true}>
      <form onSubmit={onSave}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 500,
            width: '50vw'
          }}
        >
          <TextField
            autoComplete="off"
            label="Token"
            variant="standard"
            defaultValue={localToken ?? ''}
            inputRef={tokenRef}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              setLocalToken((event.target as HTMLInputElement).value)
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
        <DialogActions
          sx={{
            justifyContent: 'space-between'
          }}
        >
          <Stack direction="row" spacing={1.5}>
            <Button type="submit" variant="contained" disabled={!isSavable}>
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => onToggleSettings(false)}
              disabled={!token}
            >
              Cancel
            </Button>
          </Stack>
          <IconButton
            color="error"
            aria-label="delete"
            onClick={onRemove}
            disabled={!token}
          >
            <DeleteIcon />
          </IconButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Settings;
