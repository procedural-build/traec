"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMetricScore = exports.toggleForm = exports.fetchToState = void 0;

/*
* Use Middleware API to fetch data and then set it into the Redux
* state by a successStateSetFunction and failureStateSetFunction included
* in the stateParams object
*/
var fetchToState = function fetchToState(params, body) {
  // Destructure the parameters into its constituent fetch and state parmeter objects
  var fetchParams = params.fetchParams,
      stateParams = params.stateParams;
  fetchParams = Object.assign({}, {
    body: body
  }, fetchParams);
  return {
    APICallTypes: {
      defaultType: 'ENTITY_SET_FUNC'
    },
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};
/* Common action is to toggle a Boolean value (for showing forms)
*/


exports.fetchToState = fetchToState;

var toggleForm = function toggleForm(stateParams) {
  return {
    type: 'ENTITY_TOGGLE_BOOL',
    stateParams: stateParams
  };
}; // Has a metric score been set


exports.toggleForm = toggleForm;

var setMetricScore = function setMetricScore(itemDict, scoreId, commitId) {
  return {
    type: 'UI_SET_IN',
    payload: itemDict,
    stateParams: {
      itemPath: "reportScores.byCommitId.".concat(commitId, ".byId.").concat(scoreId)
    }
  };
};

exports.setMetricScore = setMetricScore;