import { fetchJSON } from "./fetch";
import { fetchToState } from "./actionCreators";
import { hasFetched } from "./fetchCache";

/* See API fetch Middleware example here
 * https://redux.js.org/recipes/reducing-boilerplate
 */

/**
 *
 * We can specify a pre-fetch hook in the fetchParameters.  This gives a chance to modify
 * the post body before performing the fetch.  This is useful if you have used a form
 * with multiple inputs, and only want to include a subset of these in the fetch request
 * with possibly others included in later async fetch calls.
 *
 * NOTE:  the original body (before the preFetchHook) is backed up to originalBody and these are
 * passed to later "nextHandlers" as the 3rd parameter (the actual body that is dispatched
 * is sent as the second parameter).
 *
 * @param dispatch
 * @param getState
 * @return {function(*): Function}
 */
export const callAPIMiddleware = ({ dispatch, getState }) => {
  return next => action => {
    const { APICallTypes } = action;

    if (!APICallTypes) {
      // Normal action: pass it on
      return next(action);
    }

    const { fetchParams, stateParams } = action;

    let { successType, failureType } = responseTypes(APICallTypes);

    // For debugging only.  Useful to put a debugging break in the IF statement so
    // that we can break on a particular request.
    /*if (requestType) {
            dispatch( Object.assign({}, fetchParams, stateParams))
        }*/

    let originalBody = fetchParams.body;
    if (fetchParams.preFetchHook) {
      fetchParams.body = fetchParams.preFetchHook(fetchParams.body);
    }

    checkThrottling(getState, fetchParams, action);

    recordFetch(fetchParams, dispatch);

    return fetchJSON(
      { ...fetchParams, path: fetchParams.url },
      data => successHandler(data, successType, originalBody, fetchParams, stateParams, dispatch),
      error => failureHandler(error, failureType, fetchParams, stateParams, dispatch)
    );
  };
};

/**
 * Check for Throttling that this URL has not been requested recently milliseconds between calls
 * @param getState
 * @param fetchParams
 * @param action
 * @return {*}
 */
export const checkThrottling = function(getState, fetchParams, action) {
  if (hasFetched(getState(), fetchParams, 1000)) {
    console.log("SKIPPING FETCH DUE TO THROTTLING", action);
    return next({
      type: "FETCH_THROTTLED",
      fetchParams
    });
  }
};

/**
 * Make a record in the redux store of this fetch (so other components wont fetch twice and also for throttling)
 * @param fetchParams
 * @param dispatch
 */
export const recordFetch = function(fetchParams, dispatch) {
  dispatch({
    type: "FETCH_SET_SENT",
    fetchParams
  });
};

/**
 * Set the success and failure types to default if they dont exist.
 * Otherwise if we don't have a success and failure type defined and error wil be thrown
 * @param APICallTypes
 * @return {{failureType: *, successType: *}}
 */
export const responseTypes = function(APICallTypes) {
  //console.log("CALLING API IN MIDDLEWARE: ", action, APICallTypes, fetchParams, stateParams)
  let { successType, failureType, defaultType } = APICallTypes;

  successType = defaultType && !successType ? defaultType : successType;
  failureType = defaultType && !failureType ? defaultType : failureType;

  if (!(successType || failureType)) {
    throw new Error("Must have (successType && failureType) OR defaultType set.");
  }

  return { successType, failureType };
};

/**
 * Catches any errors returned from the fetch
 * @param error
 * @param failureType
 * @param fetchParams
 * @param stateParams
 * @param dispatch
 */
export const failureHandler = function(error, failureType, fetchParams, stateParams, dispatch) {
  console.warn("Error with API request:", error);

  dispatch({
    type: "FETCH_FAIL",
    fetchParams
  });

  dispatch({
    type: failureType,
    payload: { errors: error },
    stateParams,
    fetchParams
  });
};

/**
 * Processes the fetch if successful.
 * If more fetchHandlers are defined then they will be processed here.
 * If a post success hook is defined it will be processed here as well.
 * @param data
 * @param successType
 * @param originalBody
 * @param fetchParams
 * @param stateParams
 * @param dispatch
 */
export const successHandler = function(data, successType, originalBody, fetchParams, stateParams, dispatch) {
  Object.assign(data, { errors: null }); // nullify errors if success

  //console.log("Success with API request", data)
  dispatch({
    type: "FETCH_SUCCESS",
    fetchParams
  });

  //
  dispatch({
    type: successType,
    payload: data,
    stateParams,
    fetchParams
  });

  // Here we can dispatch more fetchHandlers using the data we retrieved
  if (fetchParams.nextHandlers && fetchParams.nextHandlers.length) {
    console.log("Dispatching next fetchHandlers");
    fetchParams.nextHandlers.map((handler, i) => {
      let newParams = handler(data, fetchParams.body, originalBody);
      let nextAction = fetchToState(newParams);
      dispatch(nextAction);
    });
  }

  // See if there are any postSuccess hooks to do
  if (fetchParams.postSuccessHook) {
    fetchParams.postSuccessHook(data);
  }
};
