/**
 * Check the Redux store for cached API requests and return false for calls to the
 * same API endpoint that occur at time longer than TIMELIM.
 *
 * This function is used for client-side checking and throttling of API requests
 * to prevent multiple requests to the same API endpoint - which is possible if
 * loading components recursively which can happen often in supply-chain apps
 * @method
 * @memberof redux.fetch
 * @param {object} state - the IMMUTABLE Redux state
 * @param {object} fetchParams - the fetchParams object (obtained from a fetchHandler)
 * @param {integer} TIMELIM - subsequent call to the same API endpoint within TIMELIM will return true
 */
export const hasFetched = (state, fetchParams, TIMELIM = 1000) => {
  let { method, url } = fetchParams;
  let key = `${method} ${url}`;
  let details = state.getIn(["fetch", key]);
  let now = new Date();
  if (details) {
    if (details.get("status") != "failed") {
      let lastTimeSent = details.get("timeSent");
      if (lastTimeSent) {
        let dt = now - lastTimeSent;
        if (dt < TIMELIM) {
          return true;
        }
      }
    }
  }
};
