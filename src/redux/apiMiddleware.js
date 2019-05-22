import {fetchBlob, fetchJSON} from './fetch'
import {fetchToState} from './actionCreators'
import {hasFetched} from './fetchCache'


/* See API fetch Middleware example here
* https://redux.js.org/recipes/reducing-boilerplate 
*/

export const callAPIMiddleware = ({dispatch, getState}) => {
    return next => action => {

        const { APICallTypes } = action
        
        if (!APICallTypes) {
            // Normal action: pass it on
            return next(action)
        }
        
        const { fetchParams, stateParams } = action
        //console.log("CALLING API IN MIDDLEWARE: ", action, APICallTypes, fetchParams, stateParams)
        let {requestType, successType, failureType, defaultType} = APICallTypes

        // Set the success and failure types to default if they dont exist
        successType = (defaultType && !successType) ? defaultType : successType
        failureType = (defaultType && !failureType) ? defaultType : failureType
        // If we don't have a success and failure type defined
        if (!(successType || failureType)) { 
            throw new Error('Must have (successType && failureType) OR defaultType set.')
        }

        // For debugging only.  Useful to put a debugging break in the IF statement so 
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
        let orgbody = fetchParams.body
        if (fetchParams.preFetchHook) {
            fetchParams.body = fetchParams.preFetchHook(fetchParams.body)
        }

        // Check for Throttling that this URL has not been requested recently
        // milliseconds between calls
        if (hasFetched(getState(), fetchParams, 1000)) {
            console.log("SKIPPING FETCH DUE TO THROTTLING", action)
            return next({
                type: 'FETCH_THROTTLED',
                fetchParams
            })
        }

        // Make a record in the redux store of this fetch (so other components wont fetch twice 
        // and also for throttling)
        dispatch({
            type: 'FETCH_SET_SENT',
            fetchParams,
        })

        return fetchJSON(Object.assign(
            fetchParams, 
            {
                path: fetchParams.url,
                success: (data) => {
                    Object.assign(data, {errors: null});  // nullify errors if success

                    //console.log("Success with API request", data)
                    dispatch({
                        type: 'FETCH_SUCCESS',
                        fetchParams,
                    });

                    //
                    dispatch({
                        type: successType,
                        payload: data,
                        stateParams, fetchParams
                    });

                    // Here we can dispatch more fetchHandlers using the data we retrieved
                    if (fetchParams.nextHandlers && fetchParams.nextHandlers.length) {
                        console.log("Dispatching next fetchHandlers")
                        fetchParams.nextHandlers.map( (handler, i) => {
                            let newParams = handler(data, fetchParams.body, orgbody)
                            let nextAction = fetchToState(newParams)
                            dispatch(nextAction)
                        })
                    }

                    // See if there are any postSuccess hooks to do
                    if (fetchParams.postSuccessHook) {
                        fetchParams.postSuccessHook(data)
                    }
                },
                failure: (error) => {
                    console.log("Error with API request", error)
                    dispatch({
                        type: 'FETCH_FAIL',
                        fetchParams,
                    })
                    //
                    dispatch({
                        type: failureType,
                        payload: {errors: error},
                        stateParams, fetchParams
                    })
                }
            }
        ));
    }
}