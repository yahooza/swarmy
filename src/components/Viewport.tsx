import type { LatLngExpression } from 'leaflet';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FETCH_LIMIT, MILLISECONDS_IN_1_SECOND } from '../lib/Constants';
import { fetchCheckins } from '../lib/Api';

import {
  FetchState,
  FoursquareVenue,
  FoursquareCheckin,
  FoursquareVenueWithCheckins,
  MapConfig,
  ToggleModalCallback,
  MessageKey
} from '../lib/Types';
import { isValidApiToken } from '../lib/Utils';
import { AppContext, AppContextType } from './AppProvider';

import Header from './Header';
import Mapped from './Mapped';
import Settings from './Settings';
import { VenueDetails } from './VenueDetails';

const Viewport = ({ latlng, zoom }: MapConfig) => {
  const { t } = useTranslation();
  const { environment, token, sendMessage } = useContext(
    AppContext
  ) as AppContextType;
  const [fetchState, setFetchState] = useState<FetchState>(() => {
    const timestamp = Math.floor(
      new Date().getTime() / MILLISECONDS_IN_1_SECOND
    );
    return {
      bounds: {
        oldest: timestamp,
        newest: timestamp
      }
    };
  });

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [venues, setVenues] = useState(new Map<string, FoursquareVenue>());
  const [checkins, setCheckins] = useState<FoursquareCheckin[] | null>([]);
  const [activeVenueWithCheckins, setActiveVenueWithCheckins] =
    useState<FoursquareVenueWithCheckins | null>(null);

  const hasValidToken = useMemo(() => isValidApiToken({ token }), [token]);

  /**
   * @param newCheckins Post-fetch callback to process checkins
   * @returns {boolean} success or not
   */
  const handleCheckins = (newCheckins: Array<FoursquareCheckin>): boolean => {
    try {
      newCheckins.forEach((checkin: FoursquareCheckin) => {
        const { venue } = checkin;
        if (venues.has(venue.id)) {
          return;
        }
        venues.set(venue.id, venue);
      });
      setVenues(new Map([...venues]));
      setCheckins(
        checkins.concat(newCheckins).sort((a, b) => a.createdAt - b.createdAt)
      );
      return true;
    } catch (exception) {
      sendMessage({
        type: MessageKey.Error,
        message: t('message.error-processing-checkins')
      });
    }
    return false;
  };

  /**
   * Periodically, fetch new Foursquare Checkins
   */
  useEffect(() => {
    return;
    const INTERVAL_CHECK_FOR_NEW_CHECKINS_IN_SECONDS = 60;
    const interval = setInterval(() => {
      if (!hasValidToken || fetchState.bounds.newest == null) {
        return;
      }
      fetchCheckins({
        token,
        after: checkins.slice().shift().createdAt
      });
    }, INTERVAL_CHECK_FOR_NEW_CHECKINS_IN_SECONDS * MILLISECONDS_IN_1_SECOND);
    return () => clearInterval(interval);
  }, [hasValidToken, fetchState.bounds.newest]);

  /**
   * Fetches previous Foursquare Checkins
   */
  useEffect(() => {
    if (!hasValidToken || fetchState.bounds.oldest == null) {
      return;
    }

    fetchCheckins({
      token,
      before: fetchState.bounds.oldest
    })
      .then((newCheckins) => {
        if (newCheckins === null) {
          return;
        }

        const handled = handleCheckins(newCheckins);
        if (handled) {
          sendMessage({
            message: `Fetched ${newCheckins.length} Checkins`
          });
        }

        setFetchState((prevState) => {
          return {
            ...prevState,
            bounds: {
              ...prevState.bounds,
              oldest:
                newCheckins.length === FETCH_LIMIT &&
                environment !== 'development'
                  ? newCheckins.slice().pop().createdAt
                  : null
            }
          };
        });
      })
      .catch((exception) => {
        sendMessage({
          message: exception.message,
          type: MessageKey.Error
        });
        return;
      });
    return;
  }, [hasValidToken, fetchState.bounds.oldest]);

  /**
   * The user has selected a Venue
   * @param venueId
   */
  const onVenueSelected = (venueId: string | null) => {
    // Don't do anything if state does change.
    if (
      venueId === activeVenueWithCheckins?.venue?.id ||
      (venueId === null && activeVenueWithCheckins === null)
    ) {
      return;
    }

    if (venueId === null) {
      setActiveVenueWithCheckins(null);
      return;
    }

    if (!venues.has(venueId)) {
      return;
    }

    setActiveVenueWithCheckins({
      venue: venues.get(venueId),
      checkins: checkins.filter((checkin) => checkin.venue.id === venueId)
    });
    return;
  };

  const onToggleSettings: ToggleModalCallback = (brute?: boolean) => {
    if (brute != null) {
      setSettingsOpen(brute);
      return;
    }
    setSettingsOpen(!settingsOpen);
    return;
  };

  return (
    <>
      <Header
        checkins={checkins}
        venues={venues}
        activeVenue={activeVenueWithCheckins?.venue}
        onVenueSelected={onVenueSelected}
        onToggleSettings={onToggleSettings}
      />
      <VenueDetails
        venueWithCheckins={activeVenueWithCheckins}
        onClose={() => onVenueSelected(null)}
      />
      {(!hasValidToken || settingsOpen) && (
        <Settings onToggleSettings={onToggleSettings} />
      )}
      <Mapped
        venues={venues}
        activeVenueWithCheckins={activeVenueWithCheckins}
        onVenueSelected={onVenueSelected}
        origin={latlng as LatLngExpression}
        zoom={zoom}
      />
    </>
  );
};

export default Viewport;
