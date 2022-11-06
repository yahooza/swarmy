// The query string parsed into a URLSearchParams object
export type QueryParamsType = Record<string, string>;

/**
 * @see ./src/config.json.default
 */
export enum AppConfigKey {
  Token = 'token',
  Latlng = 'latlng',
  Zoom = 'zoom'
}

export type AppConfigValue = string | number | boolean | Array<number>;

export type AppConfig = {
  [AppConfigKey.Token]?: string;
  [AppConfigKey.Latlng]?: number[];
  [AppConfigKey.Zoom]?: number;
};

/**
 * Api Fetcher
 */
export type FetchState = {
  hasMore: boolean;
  newestCheckinTimestamp?: number;
  oldestCheckinTimestamp?: number;
  urlSearchParams: QueryParamsType;
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
