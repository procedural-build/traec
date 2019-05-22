"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCommitIndicator = exports.putCommitIndicator = exports.postCommitIndicator = exports.getCommitIndicators = void 0;

var getCommitIndicators = function getCommitIndicators(_ref) {
  var trackerId = _ref.trackerId,
      commitId = _ref.commitId,
      _ref$allAvailable = _ref.allAvailable,
      allAvailable = _ref$allAvailable === void 0 ? false : _ref$allAvailable;
  var queryStr = allAvailable ? '?allAvailable=true' : '';
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/indicator/").concat(queryStr),
    apiId: 'api_tracker_commit_indicator_list',
    requiredParams: ['trackerId', 'commitId'],
    queryParams: {
      allAvailable: false
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var path = "commitEdges.byId.".concat(commitId, ".indicators");

    if (allAvailable) {
      path = 'indicators.byId';
    }

    var newState = state.addListToDict(path, data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCommitIndicators = getCommitIndicators;

var postCommitIndicator = function postCommitIndicator(_ref2) {
  var trackerId = _ref2.trackerId,
      commitId = _ref2.commitId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/indicator/"),
    apiId: 'api_tracker_commit_indicator_create',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addListToDict("commitEdges.byId.".concat(commitId, ".indicators"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postCommitIndicator = postCommitIndicator;

var putCommitIndicator = function putCommitIndicator(_ref3) {
  var trackerId = _ref3.trackerId,
      commitId = _ref3.commitId,
      indicatorId = _ref3.indicatorId;

  var _postCommitIndicator = postCommitIndicator({
    trackerId: trackerId,
    commitId: commitId
  }),
      fetchParams = _postCommitIndicator.fetchParams,
      stateParams = _postCommitIndicator.stateParams;

  Object.assign(fetchParams, {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/indicator/").concat(indicatorId, "/"),
    apiId: 'api_tracker_commit_indicator_update',
    requiredParams: ['trackerId', 'commitId', 'indicatorId']
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.putCommitIndicator = putCommitIndicator;

var deleteCommitIndicator = function deleteCommitIndicator(_ref4) {
  var trackerId = _ref4.trackerId,
      commitId = _ref4.commitId,
      indicatorId = _ref4.indicatorId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/indicator/").concat(indicatorId, "/"),
    apiId: 'api_tracker_commit_indicator_delete',
    requiredParams: ['trackerId', 'commitId', 'indicatorId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    return state.removeInPath("commitEdges.byId.".concat(commitId, ".indicators.").concat(indicatorId));
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteCommitIndicator = deleteCommitIndicator;