import React, { useEffect, useMemo, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Drawer, styled, Tab, Typography } from '@mui/material';
import { ZERO } from '../lib/Constants';
import { FoursquareVenueWithCheckins } from '../lib/Types';
import CheckinsList from './CheckinsList';
import PhotosList from './PhotosList';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
  venueWithCheckins: FoursquareVenueWithCheckins | null | undefined;
};

export const VenueDetails = ({ onClose, venueWithCheckins }: Props) => {
  const { t } = useTranslation();
  // Unique Venue
  const venueId = useMemo(
    () => venueWithCheckins?.venue?.id ?? null,
    [venueWithCheckins]
  );

  // Photos
  const photos = useMemo(
    () =>
      venueWithCheckins?.checkins.reduce(
        (acc, checkin) => acc.concat(checkin.photos?.items ?? []),
        []
      ),
    [venueWithCheckins]
  );

  // Checkins
  const checkins = useMemo(
    () => venueWithCheckins?.checkins ?? [],
    [venueWithCheckins?.checkins]
  );

  const [tab, setTab] = useState('checkins');
  useEffect(
    () => setTab(photos?.length > ZERO ? 'photos' : 'checkins'),
    [venueId]
  );

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) =>
    setTab(newTab);

  return (
    <Drawer
      anchor={'left'}
      hideBackdrop={false}
      elevation={12}
      PaperProps={{
        sx: {
          p: 3,
          width: '35%'
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
          <TabList onChange={handleTabChange} aria-label={t('venue_details')}>
            <Tab
              label={`${t('checkins')} (${checkins?.length ?? ZERO})`}
              value="checkins"
            />
            <Tab
              label={`${t('photos')} (${photos?.length ?? ZERO})`}
              value="photos"
            />
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
