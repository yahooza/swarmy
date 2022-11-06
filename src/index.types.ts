// The query string parsed into a URLSearchParams object
export type QueryParamsType = Record<string, string>;

export type AppConfig = {
  token: string;
  latlng: number[];
  zoom: number;
};

export type FetchParams = {
  hasMore: boolean;
  newestCheckinTimestamp?: number;
  oldestCheckinTimestamp?: number;
  urlSearchParams: Record<string, string>;
};

export type FoursquareVenue = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    formattedAddress: [string];
    postalCode: string;
    country: string;
  };
};

export type FoursquareCheckin = {
  id: string;
  createdAt: number;
  photos?: {
    items?: [
      id: string,
      createdAt: number,
      prefix: string,
      suffix: string,
      width: number,
      height: number
    ];
  };
  venue: FoursquareVenue;
};

export type FoursquareVenueWithCheckins = {
  venue: FoursquareVenue;
  checkins: FoursquareCheckin[];
};
