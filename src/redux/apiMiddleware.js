import { fetchJSON } from "./fetch";
import { fetchToState } from "./actionCreators";
import { hasFetched } from "./fetchCache";

/**
 * Redux Middleware for API Fetches
 * @memberof redux
 * @namespace middleware
 */

/* See API fetch Middleware example here
 * https://redux.js.org/recipes/reducing-boilerplate
 */

/**
 * We can specify a pre-fetch hook in the fetchParameters.  This gives a chance to modify
 * the post body before performing the fetch.  This is useful if you have used a form
 * with multiple inputs, and only want to include a subset of these in the fetch request
 * with possibly others included in later async fetch calls.
 *
 * NOTE:  the original body (before the preFetchHook) is backed up to originalBody and these are
 * passed to later "nextHandlers" as the 3rd parameter (the actual body that is dispatched
 * is sent as the second parameter).
 *
 * @method
 * @memberof redux.middleware
 * @param {object} obj - An object
 * @param {function} obj.dispatch - Method to dispatch actions and trigger state changes to the store
 * @param {function} obj.getState - Returns the current state tree of your application. It is equal to the last value returned by the store's reducer.
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

    checkThrottling(getState, fetchParams, action, next);

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
 * @method
 * @memberof redux.middleware
 * @param getState Returns the current state tree of your application. It is equal to the last value returned by the store's reducer.
 * @param fetchParams
 * @param action Payloads of information that send data from your application to your store.
 * @param next
 * @return {*}
 */
export const checkThrottling = function(getState, fetchParams, action, next) {
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
 * @method
 * @memberof redux.middleware
 * @param fetchParams
 * @param {action} dispatch  Method to dispatch actions and trigger state changes to the store
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
 * @method
 * @memberof redux.middleware
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
 * @method
 * @memberof redux.middleware
 * @param error
 * @param failureType
 * @param fetchParams
 * @param stateParams
 * @param {action} dispatch  Method to dispatch actions and trigger state changes to the store
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
 * @method
 * @memberof redux.middleware
 * @param data
 * @param successType
 * @param originalBody
 * @param fetchParams
 * @param stateParams
 * @param {action} dispatch  Method to dispatch actions and trigger state changes to the store
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
