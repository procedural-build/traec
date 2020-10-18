/**
 * Redux Middleware for API Fetches
 * @memberof redux
 * @namespace actioncreators
 */

/**
 * Use Middleware API to fetch data and then set it into the Redux
 * state by a successStateSetFunction and failureStateSetFunction included
 * in the stateParams object
 * @memberof redux.actioncreators
 */
export const fetchToState = (params, body) => {
  // Destructure the parameters into its constituent fetch and state parmeter objects
  let { fetchParams, stateParams } = params;
  fetchParams = Object.assign({}, { body }, fetchParams);
  return {
    APICallTypes: { defaultType: "ENTITY_SET_FUNC" },
    fetchParams,
    stateParams
  };
};

/**
 *  Common action is to toggle a Boolean value (for showing forms)
 * @memberof redux.actioncreators
 */
export const toggleForm = stateParams => {
  return {
    type: "ENTITY_TOGGLE_FORM",
    stateParams
  };
};

/**
 *  Common action is to toggle a Boolean value (for showing forms)
 * @memberof redux.actioncreators
 */
export const setShowForm = stateParams => {
  return {
    type: "ENTITY_SHOW_FORM",
    stateParams
  };
};

/**
 *
 * Has a metric score been set
 * @memberof redux.actioncreators
 */
export const setMetricScore = (itemDict, scoreId, commitId) => {
  return {
    type: "UI_SET_IN",
    payload: itemDict,
    stateParams: {
      itemPath: `reportScores.byCommitId.${commitId}.byId.${scoreId}`
    }
  };
};

export const setNavBarItems = itemDict => {
  return {
    type: "UI_SET_IN",
    payload: itemDict,
    stateParams: {
      itemPath: "navbar.items"
    }
  };
};

export const setSideBarItems = itemDict => {
  return {
    type: "UI_SET_IN",
    payload: itemDict,
    stateParams: {
      itemPath: "sidebar.items"
    }
  };
};

export const setUIItems = (itemDict, stateParams) => {
  return {
    type: "UI_SET_IN",
    payload: itemDict,
    stateParams
  };
};

export const mergeInUI = (itemDict, stateParams) => {
  return {
    type: "UI_MERGE_IN",
    payload: itemDict,
    stateParams
  };
};
