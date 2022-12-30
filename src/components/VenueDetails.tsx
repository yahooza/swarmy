import React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Drawer, Tab, Typography } from '@mui/material';
import { ZERO } from '../lib/Constants';
import { FoursquareVenueWithCheckins } from '../lib/Types';
import CheckinsList from './CheckinsList';
import PhotosList from './PhotosList';

type Props = {
  onClose: () => void;
  venueWithCheckins: FoursquareVenueWithCheckins | null | undefined;
};

export const VenueDetails = ({ onClose, venueWithCheckins }: Props) => {
  // Unique Venue
  const venueId = React.useMemo(
    () => venueWithCheckins?.venue?.id ?? null,
    [venueWithCheckins]
  );

  // Photos
  const photos = React.useMemo(
    () =>
      venueWithCheckins?.checkins.reduce(
        (acc, checkin) => acc.concat(checkin.photos?.items ?? []),
        []
      ),
    [venueWithCheckins]
  );

  // Checkins
  const checkins = React.useMemo(
    () => venueWithCheckins?.checkins ?? [],
    [venueWithCheckins?.checkins]
  );

  const [tab, setTab] = React.useState('checkins');
  React.useEffect(
    () => setTab(photos?.length > ZERO ? 'photos' : 'checkins'),
    [venueId]
  );

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) =>
    setTab(newTab);

  return (
    <Drawer
      anchor={'right'}
      elevation={12}
      PaperProps={{
        sx: {
          mt: 10,
          p: 5,
          width: '55%'
        }
      }}
      open={venueWithCheckins != null}
      onClose={onClose}
    >
      <Box
        sx={{
          mb: 3
        }}
      >
        <Typography variant="h3" noWrap>
          {venueWithCheckins?.venue.name}
        </Typography>
        <Typography variant="h5">
          {venueWithCheckins?.venue.location.formattedAddress.join(', ')}
        </Typography>
      </Box>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab
              label={`Checkins (${checkins?.length ?? ZERO})`}
              value="checkins"
            />
            <Tab label={`Photos (${photos?.length ?? ZERO})`} value="photos" />
          </TabList>
        </Box>
        <TabPanel
          value="checkins"
          sx={{
            my: 1,
            px: 0
          }}
        >
          <CheckinsList checkins={checkins} />
        </TabPanel>
        <TabPanel
          value="photos"
          sx={{
            px: 0
          }}
        >
          <PhotosList photos={photos} />
        </TabPanel>
      </TabContext>
    </Drawer>
  );
};
