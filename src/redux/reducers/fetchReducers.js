import Im from "../../immutable";

// Milliseconds to warn if the response is longer than this
const WARNTIME = 1500;

const initialState = Im.fromJS({});

/**
 *  fetchReducers.js line 9
 * @memberof redux.reducers
 * @param action
 */

const get_key = action => {
  let { method, url } = action.fetchParams;
  return `${method} ${url}`;
};

/**
 * fetchReducers.js line 19
 * @memberof redux.reducers
 * @param timeSent
 * @param now
 * @param action
 */
const checkResponseTime = (timeSent, now, action) => {
  if (timeSent) {
    let dt = now - timeSent;
    if (dt > WARNTIME) {
      console.warn(`FETCH TIME ${dt}ms EXCEEDED LIMIT`, action);
    }
  }
  //console.warn("NO timSent FOUND FOR FETCH RESPONSE", action)
};

export default function(state = initialState, action) {
  let key = null;
  let details = null;
  let now = null;
  switch (action.type) {
    case "FETCH_SET_SENT":
      key = get_key(action);
      // See if there is already an object in state
      details =
        state.get(key) ||
        Im.fromJS({
          timeSent: new Date(),
          timeRecv: null,
          status: "sent",
          refreshRequired: false,
          retries: 0,
          failures: 0
        });
      // If the last call was a failure then increment the retries counter
      if (details.get("status") == "failure") {
        details = details.update("retries", 0, value => value + 1);
      }
      // Set the status to sent
      if (details.get("status") != "sent") {
        details = details.set("status", "sent");
        details = details.set("timeSent", new Date());
      }
      return state.set(key, details);
    case "FETCH_SUCCESS":
      key = get_key(action);
      now = new Date();
      checkResponseTime(state.getIn([key, "timeSent"]), now, action);
      // print a little warning of the
      return state.mergeIn(
        [key],
        Im.fromJS({
          status: "success",
          timeRecv: now,
          failures: 0,
          retries: 0
        })
      );
    case "FETCH_FAIL":
      key = get_key(action);
      now = new Date();
      checkResponseTime(state.getIn([key, "timeSent"]), now, action);
      details = state.get(key);
      return state.mergeIn(
        [key],
        Im.fromJS({
          status: "failed",
          timeRecv: now,
          failures: details.get("failures", 0) + 1,
          errors: action.error.statusText,
          error: action.error
        })
      );
    default:
      return state;
  }
}
