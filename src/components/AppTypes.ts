// The query string parsed into a URLSearchParams object
export type QueryParams = Record<string, string>;

export type AppMessage = 'error' | 'warning' | null | undefined;
export type AppMessageCallback = ({
  message,
  type
}: {
  message: string;
  type?: AppMessage;
}) => void;

/**
 * @see ./src/config.json.default
 */
export enum AppConfigKey {
  Token = 'token',
  Latlng = 'latlng',
  Zoom = 'zoom',
  onMessage = 'onMessage'
}
export type AppConfigValue = string | number | boolean | Array<number>;
export type AppConfig = {
  [AppConfigKey.Token]?: string;
  [AppConfigKey.Latlng]?: number[];
  [AppConfigKey.Zoom]?: number;
  [AppConfigKey.onMessage]?: AppMessageCallback;
};

export type AppParams = AppConfig & AppMessageCallback;

/**
 * When the User wants to update the Config
 */
export type AppConfigUpdateCallback = (
  key: AppConfigKey,
  value: AppConfigValue
) => void;

/**
 * Api Fetcher
 */
export type FetchState = {
  hasMore: boolean;
  newestCheckinTimestamp?: number;
  oldestCheckinTimestamp?: number;
  urlSearchParams: QueryParams;
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
