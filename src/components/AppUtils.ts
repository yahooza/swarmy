import { API_TOKEN_MIN_LENGTH } from './AppConstants';
import { ApiToken } from './AppTypes';

export const isValidApiToken = ({ token }: { token: ApiToken }) => {
  if (!token) {
    return false;
  }
  return token.length > API_TOKEN_MIN_LENGTH;
};
