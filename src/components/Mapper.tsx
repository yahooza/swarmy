import type { LatLngExpression } from 'leaflet';
import React from 'react';
import {
  FETCH_LIMIT,
  FETCH_OFFSET_IN_MILLISECONDS,
  MILLISECONDS_IN_1_SECOND,
  URL_4SQ_V2_ENDPOINT_CHECKINS
} from '../lib/Constants';

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

const Mapper = ({ latlng, zoom }: MapConfig) => {
  const { environment, token, sendMessage, updateSettings } = React.useContext(
    AppContext
  ) as AppContextType;
  const [fetchState, setFetchState] = React.useState<FetchState>(() => {
    const timestamp = Math.floor(
      new Date().getTime() / MILLISECONDS_IN_1_SECOND
    );
    return {
      token,
      bounds: {
        oldest: timestamp,
        newest: timestamp
      }
    };
  });

  const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false);
  const [venues, setVenues] = React.useState(
    new Map<string, FoursquareVenue>()
  );
  const [checkins, setCheckins] = React.useState<FoursquareCheckin[] | null>(
    []
  );
  const [activeVenueWithCheckins, setActiveVenueWithCheckins] =
    React.useState<FoursquareVenueWithCheckins | null>(null);

  const hasValidToken = React.useMemo(
    () => isValidApiToken({ token }),
    [token]
  );

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
        message: 'Failed to process checkins'
      });
    }
    return false;
  };

  /**
   * Get stuff the API
   * @param before {number}
   * @returns {void}
   */
  const fetchCheckins = async ({
    before,
    after
  }: {
    before?: number | null;
    after?: number | null;
  }) => {
    const params = new URLSearchParams({
      v: '20130101',
      limit: FETCH_LIMIT.toString(),
      format: 'json',
      oauth_token: fetchState.token
    });
    if (before != null) {
      params.append(
        'beforeTimestamp',
        (before - FETCH_OFFSET_IN_MILLISECONDS).toString()
      );
    }
    if (after != null) {
      params.append(
        'afterTimestamp',
        (after + FETCH_OFFSET_IN_MILLISECONDS).toString()
      );
    }
    return await fetch([URL_4SQ_V2_ENDPOINT_CHECKINS, params].join('?'))
      .then((response) => response.json())
      .then((data) => {
        const newCheckins = data?.response?.checkins?.items;
        if (!newCheckins) {
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
        return;
      })
      .catch((exception) => {
        sendMessage({
          message: exception.message,
          type: MessageKey.Error
        });
        return;
      });
  };

  /**
   * Periodically, fetch new Foursquare Checkins
   */
  React.useEffect(() => {
    return;
    const INTERVAL_CHECK_FOR_NEW_CHECKINS_IN_SECONDS = 60;
    const interval = setInterval(() => {
      if (!hasValidToken || fetchState.bounds.newest == null) {
        return;
      }
      fetchCheckins({
        after: checkins.slice().shift().createdAt
      });
    }, INTERVAL_CHECK_FOR_NEW_CHECKINS_IN_SECONDS * MILLISECONDS_IN_1_SECOND);
    return () => clearInterval(interval);
  }, [hasValidToken, fetchState.bounds.newest]);

  /**
   * Fetches previous Foursquare Checkins
   */
  React.useEffect(() => {
    if (!hasValidToken || fetchState.bounds.oldest == null) {
      return;
    }
    fetchCheckins({
      before: fetchState.bounds.oldest
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
    if (brute !== undefined) {
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
        onClose={() => {
          onVenueSelected(null);
        }}
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

export default Mapper;
