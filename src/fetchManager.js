import { fetchToState, toggleForm } from "./redux/actionCreators";
import { handlerMap } from "./handlerMap";
import { hasFetched } from "./redux/fetchCache";
import store from "./redux/store";

/**
 * This is a wrapper around the fetchHandlers which manages the setting, getting
 * and dispatching of the fetchHandler methods.  So instead of calling fetchHandlers
 * from within a connected React component like as per example below.
 *
 * This class includes "hooks" which may be used to trigger actions and other events.
 * Hooks available are (see functions for more information):
 * * preUpdateHook
 * * preDispatchHook
 *
 * @param {string} apiId The apiId of the fetchHandler that this relates to (obtained from Swagger API docs) with leading api_ and trailing action (_read, _update, etc.) stripped
 * @param {string} method The fetchHandler HTTP method that will be used to call the API (ie. read, list, put, patch, delete)
 * @param {object} params the parameters object {fetchParams, stateParams}.
 * @param {object} overrides overrides to any key of this class object (useful for defining hooks at instantiation)
 * @return {object} an instance of this class
 *
 * @example
 * import Traec from 'traec'
 *
 * class MyComponent extends React.Component {
 *     constructor(props) {
 *         super(props)
 *
 *         this.requiredFetches = [
 *             new Traec.Fetch('project_tracker', 'list'),
 *             new Traec.Fetch('tracker', 'list'),
 *         ]
 *     }
 *
 *     componentDidMount() {
 *         Traec.fetchRequired.bind(this)()
 *     }
 *
 *     componentDidUpdate() {
 *         Traec.fetchRequired.bind(this)()
 *     }
 * }
 */
export default class Fetch {
  constructor(apiId, method, params, overrides = {}) {
    /* HOOKS 
        Override these to do something prior to dispatch
        (ie. validate action.fetchParms.body or display a notification)*/
    this.preDispatchHook = action => action;
    this.preUpdateHook = args => args;

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

  /**
   * Check if this fetch has been made within the cache timeout period
   * @return {boolean} True if we have requested data from this endpoint within cacheTimeout period
   */
  hasFetched() {
    // Check the Redux fetch
    if (this.method == "GET") {
      return hasFetched(store.getState(), this._fetchParams, this.cacheTimout);
    }
    return false;
  }

  /**
   * If there is a stateCheckFunc in the stateParams then check if data already exists in the redux store
   * @return {boolean} or null if stateCheckFunc does not exist.
   */
  hasData() {
    // If there is a stateCheckFunc in the stateParams then use that to check
    // if data already exists in the redux store.
    let { stateCheckFunc } = this.params.stateParams;
    if (!stateCheckFunc) {
      return null;
    }
    return stateCheckFunc(store.getState());
  }

  /**
   * Update the parameters for this Fetch based on
   *
   * **Notes**:
   * * the second argument is redundant (you can pass the queryParams through the first "params" parameter if you want)
   * * this function first calls "preUpdateHook" which provides an opportunity to modify the parameters that are passed to the fetchHandler.  See the documentation for "preUpdateHook"
   *
   * @param {object} params The parameters in an object that will be destructured in the fetchHandler
   * @param {object} [queryParams=] The queryParameters in an object that will be destructured in the fetchHandler
   * @return {object} the parameters object {fetchParams, stateParams}.
   */
  update(params = {}, queryParams = {}) {
    params = this.preUpdateHook({ ...params, ...queryParams });
    let p = this.fetchHandler(params);
    this._fetchParams = p.fetchParams;
    this._stateParams = p.stateParams;
    return params;
  }

  /**
   * Update/override the stateParams of this Fetch
   * @param {object} [obj={}] The fetch parameters that should be overriden
   * @return {object} the parameters object {fetchParams, stateParams}.
   */
  updateStateParams(obj = {}) {
    Object.assign(this._stateParams, obj);
    return this.params;
  }

  /**
   * Update/override the fetchParams of this Fetch
   * @param {object} [obj={}] The fetch parameters that should be overriden
   * @return {object} the parameters object {fetchParams, stateParams}.
   */
  updateFetchParams(obj = {}) {
    Object.assign(this._fetchParams, obj);
    return this.params;
  }

  /**
   * If the stateParams has a "formVisPath" field then that will be toggled to
   * show/hide the form visibility parameter in Redux.
   *
   * **Note**:
   * * it is expected that there are commponents connected to Redux and watching the formVisPath to determine if the required form for this fetch should be displayed. This is done automatically by the BaseForm class of 'traec-react'.
   */
  toggleForm() {
    store.dispatch(toggleForm(this.params.stateParams));
  }

  /**
   * Dispatch the fetch (ie. request from the API) IFF the request has not already been made within cacheTimeout
   * period before the current request.
   *
   * **Note**:
   * * this calls "preDispatchHook" which provides an opportunity to trigger an action just prior to the actual fetch-action being dispatched.  This is useful for displaying an alert or popup confirmation and/or triggering a popup that may wait for a success or failure.
   */
  dispatch() {
    if (this.hasFetched()) {
      return null;
    }
    let action = fetchToState(this.params);
    this.preDispatchHook(action);
    store.dispatch(action);
  }

  /**
   * Check if the object has the required fields that can be destructured for the fetchHandler
   * @param {object} [obj={}] The fetch parameters that should be overriden
   * @return {boolean}
   */
  hasRequiredParams(obj) {
    for (let paramName of this.requiredParams) {
      if (!obj[paramName]) {
        //console.warn("Required parameters not available")
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
