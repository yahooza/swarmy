import type { LatLngExpression } from 'leaflet';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FETCH_LIMIT, MILLISECONDS_IN_1_SECOND } from './AppConstants';

import type {
  FetchState,
  FoursquareVenue,
  FoursquareCheckin,
  FoursquareVenueWithCheckins,
  AppConfig
} from './AppTypes';

import Header from './Header';
import Mapped from './Mapped';

const AppMapper = ({ token, latlng, zoom, onMessage }: AppConfig) => {
  const [fetchState, setFetchState] = useState<FetchState>({
    hasMore: true,
    oldestCheckinTimestamp: Math.floor(
      new Date().getTime() / MILLISECONDS_IN_1_SECOND
    ),
    urlSearchParams: {
      v: '20130101',
      limit: FETCH_LIMIT.toString(),
      format: 'json',
      beforeTimestamp: null,
      oauth_token: token
    }
  });
  const [venues, setVenues] = useState(new Map<string, FoursquareVenue>());
  const [checkins, setCheckins] = useState<FoursquareCheckin[] | null>([]);
  const [activeVenueWithCheckins, setActiveVenueWithCheckins] =
    useState<FoursquareVenueWithCheckins | null>(null);

  const handleCheckins = (newCheckins: Array<FoursquareCheckin>): void => {
    newCheckins.forEach((checkin: FoursquareCheckin) => {
      const { venue } = checkin;
      if (venues.has(venue.id)) {
        return;
      }
      venues.set(venue.id, venue);
    });
    setVenues(new Map([...venues]));
    setCheckins(checkins.concat(newCheckins));
    onMessage({ message: `Fetched ${newCheckins.length} Checkins` });
    return;
  };

  const fetchCheckins = async ({
    beforeTimestamp
  }: {
    beforeTimestamp: number | null;
  }) => {
    if (!beforeTimestamp) {
      return;
    }
    return await fetch(
      [
        'https://api.foursquare.com/v2/users/self/checkins',
        new URLSearchParams({
          ...fetchState.urlSearchParams,
          beforeTimestamp: beforeTimestamp.toString() ?? null
        })
      ].join('?')
    )
      .then((response) => response.json())
      .then((data) => {
        const newCheckins = data.response.checkins.items;
        const hasMore =
          newCheckins.length.toString() === fetchState.urlSearchParams.limit;
        handleCheckins(newCheckins);
        setFetchState((prevState) => {
          return {
            ...prevState,
            hasMore,
            oldestCheckinTimestamp: hasMore
              ? newCheckins.slice().pop().createdAt
              : null
          };
        });
      })
      .catch((exception) => {
        onMessage({
          message: exception.message,
          type: 'error'
        });
        return;
      });
  };

  // TODO: Periodically, fetch checkins from the future.
  useEffect(() => {
    /*
    const fetchNewCheckins = async () => {      
      fetchCheckins({
        afterTimestamp: fetchState.oldestCheckinTimestamp
      })
      return;
    }
    const interval=setInterval(() => {
      const data = fetchNewCheckins();
      if (data.response.checkins.items.length > 0) {
        // TODO: 1) Add Items to state: checkins
        // TODO: 2) Send Toast about new checkin!
      }
    }, 60000) 
    return() => clearInterval(interval)
    */
  }, []);

  useEffect(() => {
    if (fetchState.hasMore === false) {
      return;
    }
    fetchCheckins({
      beforeTimestamp: fetchState.oldestCheckinTimestamp
    });
    return;
  }, [fetchState.oldestCheckinTimestamp]);

  /**
   * The user has selected a Venue
   * @param venueId
   * @returns
   */
  const onVenueSelected = (venueId: string | null) => {
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

  return (
    <>
      <Header
        venues={venues}
        activeVenue={activeVenueWithCheckins?.venue}
        onVenueSelected={onVenueSelected}
        checkins={checkins}
      />
      <Mapped
        venues={venues}
        selectedVenueWithCheckins={activeVenueWithCheckins}
        onVenueSelected={onVenueSelected}
        origin={latlng as LatLngExpression}
        zoom={zoom}
      />
    </>
  );
};

export default AppMapper;
