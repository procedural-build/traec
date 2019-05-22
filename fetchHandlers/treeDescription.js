"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postDescription = void 0;

var postDescription = function postDescription(_ref) {
  var trackerId = _ref.trackerId,
      refId = _ref.refId,
      commitId = _ref.commitId,
      treeId = _ref.treeId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/description/")
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict('descriptions.byId', data);
      newState = newState.setInPath(formVisPath, false);
      newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".trees.").concat(treeId, ".descriptions")], [data.uid]);
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

exports.postDescription = postDescription;