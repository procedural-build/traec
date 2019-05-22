"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommitBranches = exports.getAllBranches = exports.storeCommitBranches = exports.storeCommitBranch = void 0;

var storeCommitBranch = function storeCommitBranch(state, item) {
  var newState = state; // Add the ref into the store

  var targetRef = item.target.ref;
  item.target.ref = targetRef ? targetRef.uid : null;
  newState = targetRef ? newState.addToDict("refs.byId", targetRef) : newState; // Add the target commit into the store

  var targetCommit = item.target.commit;
  item.target.commit = targetCommit ? targetCommit.uid : null;
  newState = targetCommit ? newState.addToDict("commits.byId", targetCommit) : newState; // If this item belongs to a commit then store it 

  var isRoot = item.commit ? false : true;
  var commitId = item.commit ? item.commit : targetCommit ? targetCommit.uid : null || targetRef.latest_commit.uid;
  var branchId = item.branchId;
  var rootPath = isRoot ? "root.branch.".concat(branchId, ".byId") : "commit.".concat(commitId, ".branch.").concat(branchId, ".byId");
  newState = newState.addToDict("commitBranches.".concat(rootPath), [item]);
  return newState;
};

exports.storeCommitBranch = storeCommitBranch;

var storeCommitBranches = function storeCommitBranches(state, data) {
  var newState = state;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      newState = storeCommitBranch(newState, item);
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

exports.storeCommitBranches = storeCommitBranches;

var getAllBranches = function getAllBranches(_ref) {
  var trackerId = _ref.trackerId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/branch/"),
    apiId: 'api_tracker_branch_list',
    requiredParams: ['trackerId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return storeCommitBranches(state, data);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getAllBranches = getAllBranches;

var getCommitBranches = function getCommitBranches(_ref2) {
  var trackerId = _ref2.trackerId,
      commitId = _ref2.commitId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/branch/"),
    apiId: 'api_tracker_commit_branch_list',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return storeCommitBranches(state, data);
  };

  var stateCheckFunc = function stateCheckFunc(state) {
    return !(state.getInPath("entities.commitBranches.commit.".concat(commitId)) == null);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      stateCheckFunc: stateCheckFunc
    }
  };
};

exports.getCommitBranches = getCommitBranches;