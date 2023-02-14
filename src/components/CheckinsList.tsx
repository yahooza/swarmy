import React from 'react';
import { fromUnixTime, formatISO, format } from 'date-fns';
import type { FoursquareCheckin } from '../lib/Types';

import { Alert, AlertTitle, List, ListItem, Typography } from '@mui/material';
import { ZERO, HUMAN_READABLE_DATETIME_FORMAT } from '../lib/Constants';

/**
 * Displays a list of checkins
 * @param checkins[]
 * @returns
 */
const CheckinsList = ({
  checkins
}: {
  checkins: FoursquareCheckin[] | null | undefined;
}) => {
  if (checkins == null || checkins.length <= ZERO) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No checkins yet.
      </Alert>
    );
  }
  return (
    <List sx={{ listStyleType: 'disc', pl: 2 }}>
      {checkins.map((checkin) => {
        const checkinTime = fromUnixTime(checkin.createdAt);
        return (
          <ListItem
            key={checkin.id}
            disableGutters
            disablePadding
            alignItems="flex-start"
            sx={{
              display: 'list-item'
            }}
          >
            <Typography
              variant="body1"
              component="time"
              dateTime={formatISO(checkinTime)}
            >
              {format(checkinTime, HUMAN_READABLE_DATETIME_FORMAT)}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckinsList;
