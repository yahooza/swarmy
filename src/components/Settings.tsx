import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useCallback } from 'react';
import { ConfigKey, UserConfigUpdateCallback } from './AppTypes';

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
  token?: string;
  onToggleSettings: () => void;
  onUserConfigUpdate: UserConfigUpdateCallback;
}) => {
  const onSave = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      onUserConfigUpdate({
        [ConfigKey.Token]: event.currentTarget.value
      });
    },
    [onUserConfigUpdate]
  );

  const onReset = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete this token?`)) {
      onUserConfigUpdate({
        [ConfigKey.Token]: null
      });
    }
  }, [onUserConfigUpdate]);

  return (
    <Box sx={style}>
      <Card sx={{ p: 1 }}>
        <CardHeader title="Settings" />
        <CardContent>
          <TextField
            label="Token"
            variant="standard"
            value={token}
            sx={{
              width: '100%'
            }}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={onToggleSettings}>
            Cancel
          </Button>
          <IconButton color="error" aria-label="delete" onClick={onReset}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Settings;
