// Any query string parsed into a URLSearchParams object
export type QueryParams = Record<string, string>;

export type ApiToken = string | null | undefined;

/**
 * Config (both User & App)
 * @see ./src/config.json.default (for the app config)
 */
export enum ConfigKey {
  Token = 'token',
  Latlng = 'latlng',
  Zoom = 'zoom'
}

export interface AppConfig {
  [ConfigKey.Latlng]?: Array<number>;
  [ConfigKey.Zoom]?: number;
}

export interface UserConfig {
  [ConfigKey.Token]?: string | undefined;
}

// when the User wants to update the Config
export type UserConfigUpdateCallback = (updatedUserConfig: UserConfig) => void;

export type onModalToggleCallback = (brute?: boolean) => void;

/**
 * Messages: Toasts!
 */
export type AppMessage = 'error' | 'warning' | 'success' | null | undefined;
export type AppMessageCallback = ({
  message,
  type
}: {
  message: string;
  type?: AppMessage;
}) => void;

/**
 * API Fetch state
 */
export interface FetchState {
  hasMorePastCheckins: boolean;
  newestCheckinTimestamp?: number;
  oldestCheckinTimestamp?: number;
}

/**
 * Foursquare API types
 */
export interface FoursquareVenue {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    formattedAddress: [string];
    postalCode: string;
    country: string;
  };
}

export interface FoursquareCheckin {
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
}

export interface FoursquareVenueWithCheckins {
  venue: FoursquareVenue;
  checkins: FoursquareCheckin[];
}
