/** Methods */
export const convertToQueryString = <T extends Record<string, any>>(queryParams: T) => {
  const queryString = Object.keys(queryParams)
    .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
  return queryString;
};