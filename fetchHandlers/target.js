"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCommitMetricTarget = exports.putCommitMetricTarget = exports.postCommitMetricTarget = exports.getCommitMetricTargets = void 0;

/*
METRIC TARGETS
*/
var metricTargetToState = function metricTargetToState(newState, item, commitId) {
  var baseMetric = item.metric; //let baseMetricId = baseMetric.uid
  //item.metric = baseMetricId

  newState = newState.addListToDict("baseMetrics.byId", [baseMetric]);
  newState = newState.addListToDict("commitEdges.byId.".concat(commitId, ".metricTargets"), [item]);
  return newState;
};

var getCommitMetricTargets = function getCommitMetricTargets(_ref) {
  var trackerId = _ref.trackerId,
      commitId = _ref.commitId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/target/"),
    apiId: 'api_tracker_commit_target_list',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state; // Load in the new values

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        newState = metricTargetToState(newState, item, commitId);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return newState;
  };

  var stateCheckFunc = function stateCheckFunc(state) {
    return !(state.getInPath("entities.commitEdges.byId.".concat(commitId, ".metricTargets")) == null);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      stateCheckFunc: stateCheckFunc
    }
  };
};

exports.getCommitMetricTargets = getCommitMetricTargets;

var postCommitMetricTarget = function postCommitMetricTarget(_ref2) {
  var trackerId = _ref2.trackerId,
      commitId = _ref2.commitId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/target/"),
    apiId: 'api_tracker_commit_target_create',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state; // Load in the new values

    newState = metricTargetToState(newState, data, commitId);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postCommitMetricTarget = postCommitMetricTarget;

var putCommitMetricTarget = function putCommitMetricTarget(_ref3) {
  var trackerId = _ref3.trackerId,
      commitId = _ref3.commitId,
      metricTargetId = _ref3.metricTargetId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/target/").concat(metricTargetId, "/"),
    apiId: 'api_tracker_commit_target_update',
    requiredParams: ['trackerId', 'commitId', 'metricTargetId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state; // Remove the old value if the node is replaced

    if (data.uid != metricTargetId) {
      newState = newState.removeInPath("commitEdges.byId.".concat(commitId, ".metricTargets.").concat(metricTargetId));
    } // Load in the new values


    newState = metricTargetToState(newState, data, commitId);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.putCommitMetricTarget = putCommitMetricTarget;

var deleteCommitMetricTarget = function deleteCommitMetricTarget(_ref4) {
  var trackerId = _ref4.trackerId,
      commitId = _ref4.commitId,
      metricTargetId = _ref4.metricTargetId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/target/").concat(metricTargetId, "/"),
    apiId: 'api_tracker_commit_target_delete',
    requiredParams: ['trackerId', 'commitId', 'metricTargetId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    return state.removeInPath("commitEdges.byId.".concat(commitId, ".metricTargets.").concat(metricTargetId));
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteCommitMetricTarget = deleteCommitMetricTarget;