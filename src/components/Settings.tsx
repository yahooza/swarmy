import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ConfigKey,
  onModalToggleCallback,
  UserConfigUpdateCallback
} from './AppTypes';
import { isValidApiToken } from './AppUtils';
import { URL_4SQUARE_API_DOCS } from './AppConstants';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  bgcolor: 'background.paper',
  boxShadow: 24
};

const Settings = ({
  token,
  onToggleSettings,
  onUserConfigUpdate
}: {
  token?: string | null;
  onToggleSettings: onModalToggleCallback;
  onUserConfigUpdate: UserConfigUpdateCallback;
}) => {
  const [localToken, setLocalToken] = useState<string | null>(token ?? null);
  const tokenRef = useRef<HTMLInputElement>(null);

  const onSave = useCallback(() => {
    onUserConfigUpdate({
      [ConfigKey.Token]: tokenRef?.current?.value
    });
  }, [onUserConfigUpdate]);

  const onRemove = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete this token?`)) {
      onUserConfigUpdate({
        [ConfigKey.Token]: null
      });
    }
  }, [onUserConfigUpdate]);

  const isSavable = useMemo(
    () => isValidApiToken({ token: localToken }),
    [localToken]
  );

  return (
    <Modal
      open={true}
      onClose={onToggleSettings}
      aria-labelledby="Settings"
      aria-describedby="Settings for this Map"
    >
      <Paper elevation={3}>
        <Box sx={style}>
          <Card sx={{ p: 1 }}>
            <form onSubmit={onSave}>
              <CardHeader
                title="Settings"
                // eslint-disable-next-line max-len
                subheader={`To render your checkins, a valid API token is required`}
              />
              <CardContent>
                <TextField
                  autoComplete="off"
                  label="Token"
                  variant="standard"
                  defaultValue={localToken ?? ''}
                  inputRef={tokenRef}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void =>
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
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: 'space-between'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isSavable}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => onToggleSettings}
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
              </CardActions>
            </form>
          </Card>
        </Box>
      </Paper>
    </Modal>
  );
};

export default Settings;
