import { fetchToState, toggleForm } from "./redux/actionCreators";
import { handlerMap } from "./handlerMap";
import { hasFetched } from "./redux/fetchCache";
import store from "./redux/store";

/*
This is a wrapper around the fetchHandlers which manages the setting, getting 
and dispatching of the fetchHandler methods.  So instead of calling fetchHandlers
from within a connected React component like this:
let params = handlerMap[apiId][httpMethod]
this.props.dispatch(fetchToState(params))

You can use the wrapper to call it like this:
Traec.Fetch(apiId, httpMethod).dispatch()

*/

export default class Fetch {
  constructor(apiId, method, params, overrides = {}) {
    /* HOOKS 
        Override these to do something prior to dispatch
        (ie. validate action.fetchParms.body or display a notification)*/
    this.preDispatchHook = action => {
      return action;
    };
    this.preUpdateHook = args => {
      return args;
    };

    // Properties of this can be overrided on instantiation
    for (let key of Object.keys(overrides)) {
      this[key] = overrides[key];
    }

    // Store the original apiId and method calls
    this._apiId = apiId;
    this._method = method;

    // Get the fetchHandler from the map created on app initialization
    this.fetchHandler = handlerMap[apiId][method].fetchHandler;

    // Set a default cacheTimeout
    this.defaultCacheTimeout = 3600;

    // Initialize some fetch Parameters
    this.update(params);
  }

  get params() {
    return {
      fetchParams: this._fetchParams,
      stateParams: this._stateParams
    };
  }

  get url() {
    return this._fetchParams ? this._fetchParams.url : null;
  }

  get requiredParams() {
    return (this._fetchParams ? this._fetchParams.requiredParams : []) || [];
  }

  get queryParams() {
    return (this._fetchParams ? this._fetchParams.queryParams : {}) || {};
  }

  get cacheTimout() {
    return this._fetchParams.cacheTime || this.defaultCacheTimeout * 1000;
  }

  get method() {
    return this._fetchParams ? this._fetchParams.method : null;
  }

  hasFetched() {
    // Check the Redux fetch
    if (this.method == "GET") {
      return hasFetched(store.getState(), this._fetchParams, this.cacheTimout);
    }
    return false;
  }

  hasData() {
    // If there is a stateCheckFunc in the stateParams then use that to check
    // if data already exists in the redux store.
    let { stateCheckFunc } = this.params.stateParams;
    if (!stateCheckFunc) {
      return null;
    }
    return stateCheckFunc(store.getState());
  }

  update(params = {}, queryParams = {}) {
    // Note the second argument is redundant (you can pass the queryParams through the first "params" parameter if you want)
    // because they are mashed together here anyway
    params = this.preUpdateHook({ ...params, ...queryParams });
    let p = this.fetchHandler(params);
    this._fetchParams = p.fetchParams;
    this._stateParams = p.stateParams;
    return params;
  }

  updateStateParams(obj = {}) {
    Object.assign(this._stateParams, obj);
    return this.params;
  }

  updateFetchParams(obj = {}) {
    Object.assign(this._fetchParams, obj);
    return this.params;
  }

  toggleForm() {
    store.dispatch(toggleForm(this.params.stateParams));
  }

  dispatch() {
    if (this.hasFetched()) {
      return null;
    }
    let action = fetchToState(this.params);
    this.preDispatchHook(action);
    store.dispatch(action);
  }

  hasRequiredParams(obj) {
    for (let paramName of this.requiredParams) {
      if (!obj[paramName]) {
        return false;
      }
    }
    return true;
  }

  // Setter functions for
  dispatchFromProps(props, fetchedUrls, stateSet, forceFetch = false) {
    // Call the fetchHandler with the arguments provided
    // NOTE: The newProps returned may be modified by a preUpdateHook
    let newProps = this.update(props);
    // Check that the required parameters are met
    if (!this.hasRequiredParams(newProps)) {
      return null;
    }
    // Check if the URL to be fetched has already been requested in the state
    let { fetchParams } = this.params;
    fetchedUrls = fetchedUrls || {};
    if (!fetchedUrls[fetchParams.url] || forceFetch == true) {
      // Dispatch this action
      this.dispatch();
      // Update the fetched Urls flag with the flagSetter
      Object.assign(fetchedUrls, { [fetchParams.url]: true });
      stateSet({ fetchedUrls });
    }
  }
}
