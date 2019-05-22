"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllCommits = exports.patchCommit = exports.putCommit = exports.postCommit = exports.getCommits = void 0;

/*
COMMIT AND COMMIT HISTORY
*/
var getCommits = function getCommits(_ref) {
  var trackerId = _ref.trackerId,
      refId = _ref.refId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/commit/"),
    apiId: 'api_tracker_ref_commit_list',
    requiredParams: ['trackerId', 'refId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var uids = data.map(function (item) {
      return item.uid;
    });
    var newState = state.addListToDict('commits.byId', data);
    newState = newState.addListToSets(["categoryCommits.byId.".concat(refId)], uids);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCommits = getCommits;

var postCommit = function postCommit(_ref2) {
  var trackerId = _ref2.trackerId,
      refId = _ref2.refId,
      commitId = _ref2.commitId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/commit/"),
    apiId: 'api_tracker_ref_commit_create',
    requiredParams: ['trackerId', 'refId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict('commits.byId', data);
      newState = newState.setInPath("refs.byId.".concat(refId, ".latest_commit"), data);
      newState = newState.addListToSets(["categoryCommits.byId.".concat(refId)], [data.uid]);
      newState = newState.setInPath(formVisPath, false); // Remove the commitBranch information for this commit (so it is re-fetched)

      newState = newState.removeInPath("commitBranches.commit.".concat(commitId)); // Remove the categoryCommit log (so it is re-fetched)

      newState = newState.removeInPath("categoryCommits.byId.".concat(refId));
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "commits.editById.".concat(commitId, ".SHOW_COMMIT_FORM"),
      formObjPath: "commits.editById.".concat(commitId, ".newItem")
    }
  };
};

exports.postCommit = postCommit;

var putCommit = function putCommit(_ref3) {
  var trackerId = _ref3.trackerId,
      refId = _ref3.refId,
      commitId = _ref3.commitId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/commit/").concat(commitId, "/"),
    apiId: 'api_tracker_ref_commit_update',
    requiredParams: ['trackerId', 'refId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict('commits.byId', data);
      newState = newState.addListToSets(["categoryCommits.byId.".concat(refId)], [data.uid]);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "commits.editById.".concat(commitId, ".SHOW_COMMIT_FORM"),
      formObjPath: "commits.editById.".concat(commitId, ".newItem")
    }
  };
};

exports.putCommit = putCommit;

var patchCommit = function patchCommit(_ref4) {
  var trackerId = _ref4.trackerId,
      refId = _ref4.refId,
      commitId = _ref4.commitId;

  var _putCommit = putCommit({
    trackerId: trackerId,
    refId: refId,
    commitId: commitId
  }),
      fetchParams = _putCommit.fetchParams,
      stateParams = _putCommit.stateParams;

  Object.assign(fetchParams, {
    method: 'PATCH'
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.patchCommit = patchCommit;

var getAllCommits = function getAllCommits() {
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/commit/",
    apiId: 'api_tracker_commit_all_list',
    requiredParams: [],
    queryParams: {
      requiresAction: true
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return state.addToDict('commits.byId', data);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getAllCommits = getAllCommits;