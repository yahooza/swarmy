import type { CSSStyles, FoursquareVenue, FoursquareCheckin, FoursquareVenueWithCheckins } from './index.types'
import type { LatLngExpression } from 'leaflet';

import * as React from 'react';
import Header from './components/Header';
import Mapped from './components/Mapped';
import { useState, useEffect, useRef } from 'react';
import { subMonths } from 'date-fns'


const getPastMonth = () => {
  const now = new Date()
  return [now.getTime(), subMonths(now, 1).getTime()]
}

type Props = {
  token: string,
  limit? : number,
  range?: [number, number],
  lat: number,
  lng: number,
  zoom?: number,
  styles: CSSStyles
}

const App = ({ token, limit, range, lat, lng, zoom = 13, styles }: Props) => {
  const [apiToken] = useState(token ?? null);
  const [timeRange] = useState(range ?? getPastMonth())
  const [venues, setVenues] = useState(new Map<string, FoursquareVenue>())
  const [checkins, setCheckins] = useState<FoursquareCheckin[] | null>([]);
  const [activeVenueWithCheckins, setActiveVenueWithCheckins] = useState<FoursquareVenueWithCheckins | null>(null);

  useEffect(() => {
    fetch('https://api.foursquare.com/v2/users/self/checkins?' + 
      new URLSearchParams({
        'v'               : '20130101',
        'limit'           : (limit ?? 100).toString(),
        'oauth_token'     : apiToken,
        'format'          : 'json',
        'after_timestamp' : timeRange[0].toString(),
        'before_timestamp': timeRange[1].toString()
    }))
      .then((response) => response.json())
      .then((data) => {
        const newCheckins = data.response.checkins.items
        setCheckins(checkins.concat(newCheckins));

        newCheckins.forEach((checkin: FoursquareCheckin) => {
          const {venue} = checkin;
          if (venues.has(venue.id)) {
            return
          }
          venues.set(venue.id, venue)
        })

        setVenues(new Map([...venues]))
      });
  }, [apiToken, timeRange])

  const onVenueSelected = (venueId: string | null) => {
    if (!venues.has(venueId)) {
      return;
    }
    setActiveVenueWithCheckins({
      venue: venues.get(venueId),
      checkins: checkins.filter(checkin => checkin.venue.id === venueId)
    })
    return;
  }

  return (
    <>
      <Header venues={venues} onVenueSelected={onVenueSelected} />
      <Mapped
        venues={venues}
        selectedVenueWithCheckins={activeVenueWithCheckins}
        onVenueSelected={onVenueSelected}
        origin={[lat, lng] as LatLngExpression}
        zoom={zoom}
        styles={styles}
      />
    </>
  );
}

export default App