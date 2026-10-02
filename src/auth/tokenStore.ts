// Access token lives only in memory (lost on hard reload — by design).
// Refresh token is persisted so a reload doesn't force a re-login;
// the backend issues it in the JSON body rather than an httpOnly cookie,
// so this is the pragmatic option available to a pure frontend.
const REFRESH_KEY = "turfirma_refresh_token";

let accessToken: string | null = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token: string | null) => {
    if (token) localStorage.setItem(REFRESH_KEY, token);
    else localStorage.removeItem(REFRESH_KEY);
  },
  clear: () => {
    accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },
};
