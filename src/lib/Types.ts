// Any query string parsed into a URLSearchParams object
export type QueryParams = Record<string, string>;

export type ApiToken = string | null | undefined;

export type Environment = 'production' | 'development';

/**
 * Config (both User & App)
 * @see ./src/config.json.default (for the app config)
 */
export enum ConfigKey {
  Environment = 'environment',
  Token = 'token',
  Latlng = 'latlng',
  Zoom = 'zoom'
}

export interface AppConfig {
  [ConfigKey.Environment]?: string;
  [ConfigKey.Latlng]?: Array<number>;
  [ConfigKey.Zoom]?: number;
}

export interface UserConfig {
  [ConfigKey.Token]?: string | undefined;
}

// when the User wants to update the Config
export type UserConfigUpdateCallback = (updatedUserConfig: UserConfig) => void;

export type ToggleModalCallback = (brute?: boolean) => void;

/**
 * Messages: Toasts!
 */
export enum MessageKey {
  Error = 'error',
  Warning = 'warning',
  Success = 'success'
}

export type Message =
  | MessageKey.Error
  | MessageKey.Warning
  | MessageKey.Success
  | null
  | undefined;

export type MessageCallback = ({
  message,
  type
}: {
  message: string;
  type?: Message;
}) => void;

/**
 * API Fetch state
 */
export interface FetchState {
  token: string;
  bounds: {
    oldest: number | null | undefined;
    newest: number | null | undefined;
  };
}

/**
 * Foursquare API types
 */

export interface FoursquarePhoto {
  id: string;
  createdAt: number;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
}

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
    items?: FoursquarePhoto[];
  };
  venue: FoursquareVenue;
}

export interface FoursquareVenueWithCheckins {
  venue: FoursquareVenue;
  checkins: FoursquareCheckin[];
}