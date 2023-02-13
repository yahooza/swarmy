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
    .then((response) => response.json())
    .then((data) => data?.response?.checkins?.items ?? null)
    .catch((exception) => exception);
};
