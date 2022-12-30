import { API_TOKEN_MIN_LENGTH } from './Constants';
import { ApiToken } from './Types';

export const isValidApiToken = ({ token }: { token: ApiToken }) => {
  if (!token) {
    return false;
  }
  return token.length > API_TOKEN_MIN_LENGTH;
};
