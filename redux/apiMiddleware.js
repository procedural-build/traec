"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callAPIMiddleware = void 0;

var _fetch = require("./fetch");

var _actionCreators = require("./actionCreators");

var _fetchCache = require("./fetchCache");

/* See API fetch Middleware example here
* https://redux.js.org/recipes/reducing-boilerplate 
*/
var callAPIMiddleware = function callAPIMiddleware(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      var APICallTypes = action.APICallTypes;

      if (!APICallTypes) {
        // Normal action: pass it on
        return next(action);
      }

      var fetchParams = action.fetchParams,
          stateParams = action.stateParams; //console.log("CALLING API IN MIDDLEWARE: ", action, APICallTypes, fetchParams, stateParams)

      var requestType = APICallTypes.requestType,
          successType = APICallTypes.successType,
          failureType = APICallTypes.failureType,
          defaultType = APICallTypes.defaultType; // Set the success and failure types to default if they dont exist

      successType = defaultType && !successType ? defaultType : successType;
      failureType = defaultType && !failureType ? defaultType : failureType; // If we don't have a success and failure type defined

      if (!(successType || failureType)) {
        throw new Error('Must have (successType && failureType) OR defaultType set.');
      } // For debugging only.  Useful to put a debugging break in the IF statement so 
      // that we can break on a particular request.

      /*if (requestType) {
          dispatch( Object.assign({}, fetchParams, stateParams))
      }*/

      /* We can specify a pre-fetch hook in the fetchParameters.  This gives a chance to modify
      the post body before performing the fetch.  This is useful if you have used a form 
      with multiple inputs, and only want to include a subset of these in the fetch request
      with possibly others included in later async fetch calls.
       NOTE:  the original body (before the preFetchHook) is backed up to orgbody and these are 
      passed to later "nextHandlers" as the 3rd parameter (the actual body that is dispatched
      is sent as the second parameter).
      */


      var orgbody = fetchParams.body;

      if (fetchParams.preFetchHook) {
        fetchParams.body = fetchParams.preFetchHook(fetchParams.body);
      } // Check for Throttling that this URL has not been requested recently
      // milliseconds between calls


      if ((0, _fetchCache.hasFetched)(getState(), fetchParams, 1000)) {
        console.log("SKIPPING FETCH DUE TO THROTTLING", action);
        return next({
          type: 'FETCH_THROTTLED',
          fetchParams: fetchParams
        });
      } // Make a record in the redux store of this fetch (so other components wont fetch twice 
      // and also for throttling)


      dispatch({
        type: 'FETCH_SET_SENT',
        fetchParams: fetchParams
      });
      return (0, _fetch.fetchJSON)(Object.assign(fetchParams, {
        path: fetchParams.url,
        success: function success(data) {
          Object.assign(data, {
            errors: null
          }); // nullify errors if success
          //console.log("Success with API request", data)

          dispatch({
            type: 'FETCH_SUCCESS',
            fetchParams: fetchParams
          }); //

          dispatch({
            type: successType,
            payload: data,
            stateParams: stateParams,
            fetchParams: fetchParams
          }); // Here we can dispatch more fetchHandlers using the data we retrieved

          if (fetchParams.nextHandlers && fetchParams.nextHandlers.length) {
            console.log("Dispatching next fetchHandlers");
            fetchParams.nextHandlers.map(function (handler, i) {
              var newParams = handler(data, fetchParams.body, orgbody);
              var nextAction = (0, _actionCreators.fetchToState)(newParams);
              dispatch(nextAction);
            });
          } // See if there are any postSuccess hooks to do


          if (fetchParams.postSuccessHook) {
            fetchParams.postSuccessHook(data);
          }
        },
        failure: function failure(error) {
          console.log("Error with API request", error);
          dispatch({
            type: 'FETCH_FAIL',
            fetchParams: fetchParams
          }); //

          dispatch({
            type: failureType,
            payload: {
              errors: error
            },
            stateParams: stateParams,
            fetchParams: fetchParams
          });
        }
      }));
    };
  };
};

exports.callAPIMiddleware = callAPIMiddleware;