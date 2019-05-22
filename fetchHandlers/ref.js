"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTrackerRef = exports.postBranch = exports.getRefBranches = exports.postRootRef = exports.patchCategoryRef = exports.postCategoryRef = exports.getAllRefs = void 0;

var _commitBranch = require("./commitBranch");

var getAllRefs = function getAllRefs(_ref) {
  var _ref$isResponsible = _ref.isResponsible,
      isResponsible = _ref$isResponsible === void 0 ? true : _ref$isResponsible;
  var query_params = isResponsible ? "?isResponsible=true" : '?isResponsible=false';
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/ref/".concat(query_params),
    apiId: 'api_tracker_ref_all_list',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("refs.byId", data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getAllRefs = getAllRefs;

var postCategoryRef = function postCategoryRef(_ref2) {
  var trackerId = _ref2.trackerId,
      refId = _ref2.refId,
      commitId = _ref2.commitId,
      treeId = _ref2.treeId,
      _ref2$skip_categories = _ref2.skip_categories,
      skip_categories = _ref2$skip_categories === void 0 ? false : _ref2$skip_categories;
  var query_params = skip_categories ? "?skip_categories=true" : '';
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/branch/").concat(query_params),
    apiId: 'api_tracker_ref_tree_branch_create',
    requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = (0, _commitBranch.storeCommitBranch)(newState, data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "trees.editById.".concat(treeId, ".SHOW_NAME_FORM"),
      formObjPath: "trees.editById.".concat(treeId, ".newItem")
    }
  };
};

exports.postCategoryRef = postCategoryRef;

var patchCategoryRef = function patchCategoryRef(_ref3) {
  var trackerId = _ref3.trackerId,
      refId = _ref3.refId;
  var fetchParams = {
    method: 'PATCH',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/"),
    apiId: 'api_tracker_ref_partial_update',
    requiredParams: ['trackerId', 'refId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.setInPath("refs.byId.".concat(refId), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "refs.byId.".concat(refId, ".SHOW_FORM"),
      formObjPath: "refs.editById.".concat(refId, ".editObj")
    }
  };
};

exports.patchCategoryRef = patchCategoryRef;

var postRootRef = function postRootRef(_ref4) {
  var trackerId = _ref4.trackerId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/"),
    apiId: 'api_tracker_ref_create',
    requiredParams: ['trackerId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams3 = action.stateParams,
        formVisPath = _action$stateParams3.formVisPath,
        formObjPath = _action$stateParams3.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      // Response should be a ref which is added to the refs.byId and also tracker.alt_root_masters
      newState = newState.addToDict('refs.byId', data);
      newState = newState.setInPath("trackers.byId.".concat(trackerId, ".alt_root_masters.").concat(data.latest_commit.root_commit), data.uid);
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

exports.postRootRef = postRootRef;

var getRefBranches = function getRefBranches(_ref5) {
  var trackerId = _ref5.trackerId,
      refId = _ref5.refId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/submodule/"),
    apiId: 'api_tracker_ref_submodule_list',
    requiredParams: ['trackerId', 'refId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var uids = data.map(function (item) {
      return item.uid;
    });
    var newState = state;
    var commitId = null;
    var branchId = null;
    var isRoot = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        // Add the ref into the store
        var targetRef = item.target.ref;
        item.target.ref = targetRef ? targetRef.uid : null;
        newState = targetRef ? newState.addToDict("refs.byId", targetRef) : newState; // Add the target commit into the store

        var targetCommit = item.target.commit;
        item.target.commit = targetCommit ? targetCommit.uid : null;
        newState = targetCommit ? newState.addToDict("commits.byId", targetCommit) : newState; // If this item belongs to a commit then store it 

        isRoot = item.commit ? false : true;
        commitId = item.commit ? item.commit : targetCommit ? targetCommit.uid : null || targetRef.latest_commit.uid;
        branchId = item.branchId;
        var rootPath = isRoot ? "root.".concat(commitId, ".branch.").concat(branchId, ".byId") : "commit.".concat(commitId, ".branch.").concat(branchId, ".byId");
        newState = newState.addToDict("commitBranches.".concat(rootPath), [item]);
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

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getRefBranches = getRefBranches;

var postBranch = function postBranch(_ref6) {
  var trackerId = _ref6.trackerId,
      refId = _ref6.refId,
      commitId = _ref6.commitId,
      treeId = _ref6.treeId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/"),
    apiId: 'api_tracker_ref_tree_create',
    requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams4 = action.stateParams,
        formVisPath = _action$stateParams4.formVisPath,
        formObjPath = _action$stateParams4.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      var commitPath = "commitEdges.byId.".concat(commitId, ".trees.").concat(treeId);
      newState = newState.addToDict('refs.byId', data);
      newState = newState.setInPath(formVisPath, false); // Add the root commit to the category list for this tree

      var branchId = data.latest_commit.root_commit;
      newState = newState.addListToSets(["".concat(commitPath, ".categories")], [branchId]); // Add this as a commitBranch (masterHead) for the parentCommit 

      var target = {
        commit: null,
        ref: data.uid
      };
      var head = {
        commit: commitId,
        target: target,
        branchId: branchId,
        is_master: true
      };
      var branchObj = {
        targets: [target],
        masterHead: head,
        userHead: head
      };
      newState = newState.setInPath("commitBranches.commit.".concat(commitId, ".branch.").concat(branchId), branchObj);
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

exports.postBranch = postBranch;

var deleteTrackerRef = function deleteTrackerRef(_ref7) {
  var trackerId = _ref7.trackerId,
      refId = _ref7.refId,
      commitId = _ref7.commitId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/"),
    apiId: 'api_tracker_ref_delete',
    requiredParams: ['trackerId', 'refId', 'commitId'],
    // Deleting a Ref can affect so many things that its
    // best to reload the page and all data again
    postSuccessHook: function postSuccessHook(data) {
      location.reload();
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var newState = state;
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteTrackerRef = deleteTrackerRef;