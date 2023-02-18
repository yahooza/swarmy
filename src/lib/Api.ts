import { getSwitchUtilityClass } from '@mui/material';
import {
  FETCH_LIMIT,
  FETCH_OFFSET_IN_MILLISECONDS,
  URL_4SQ_V2_ENDPOINT_CHECKINS
} from './Constants';

/**
 * Get stuff the API
 * @param before {number}
 * @returns {void}
 */
export const fetchCheckins = async ({
  token,
  before,
  after
}: {
  token: string;
  before?: number | null;
  after?: number | null;
}) => {
  const params = new URLSearchParams({
    v: '20130101',
    limit: FETCH_LIMIT.toString(),
    format: 'json',
    oauth_token: token
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
    .then((response) => {
      if (response.status !== 200) {
        switch (response.status) {
          case 401:
            throw new Error(
              `Authentication failed. Please check your API token`
            );
          default:
            throw new Error(
              `Fetching data from Foursquare has errored out. Please tyr again.`
            );
        }
      }
      return response.json();
    })
    .then((data) => data?.response?.checkins?.items ?? null)
    .catch((exception) => {
      throw exception;
    });
};
