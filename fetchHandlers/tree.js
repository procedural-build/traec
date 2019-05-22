"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTree = exports.postTree = void 0;

var postTree = function postTree(_ref) {
  var trackerId = _ref.trackerId,
      refId = _ref.refId,
      commitId = _ref.commitId,
      treeId = _ref.treeId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/tree/"),
    apiId: 'api_tracker_ref_tree_tree_create',
    requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      var commitPath = "commitEdges.byId.".concat(commitId, ".trees.").concat(treeId);
      newState = newState.addToDict('trees.byId', data);
      newState = newState.setInPath(formVisPath, false);
      newState = newState.addListToSets(["".concat(commitPath, ".trees")], [data.uid]);
      newState = newState.setInPath("commitEdges.byId.".concat(commitId, ".trees.").concat(data.uid, ".parent"), treeId);
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

exports.postTree = postTree;

var deleteTree = function deleteTree(_ref2) {
  var trackerId = _ref2.trackerId,
      refId = _ref2.refId,
      commitId = _ref2.commitId,
      treeId = _ref2.treeId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/"),
    apiId: 'api_tracker_ref_tree_delete',
    requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var parentId = state.getInPath("commitEdges.byId.".concat(commitId, ".trees.").concat(treeId, ".parent"));
    var newState = state.removeInPath("commitEdges.byId.".concat(commitId, ".trees.").concat(treeId));

    if (parentId) {
      newState = newState.updateIn("commitEdges.byId.".concat(commitId, ".trees.").concat(parentId, ".trees").split('.'), function (i) {
        return i ? i["delete"](treeId) : null;
      });
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

exports.deleteTree = deleteTree;