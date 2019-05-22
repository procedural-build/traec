"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllProjectInvites = exports.deleteProjectInvite = exports.putProjectInvite = exports.postProjectInvite = exports.getProjectInvites = void 0;

var getProjectInvites = function getProjectInvites(_ref) {
  var projectId = _ref.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/invite/"),
    apiId: 'api_project_invite_list',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projectObjects.byId.".concat(projectId, ".invites"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjectInvites = getProjectInvites;

var postProjectInvite = function postProjectInvite(_ref2) {
  var projectId = _ref2.projectId;
  var fetchParams = {
    method: 'POST',
    url: "/api/project/".concat(projectId, "/invite/"),
    apiId: 'api_project_invite_create',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("projectObjects.byId.".concat(projectId, ".invites"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "ui.projectObjects.byId.".concat(projectId, ".invite.SHOW_FORM"),
      formObjPath: "ui.projectObjects.byId.".concat(projectId, ".invite.newItem")
    }
  };
};

exports.postProjectInvite = postProjectInvite;

var putProjectInvite = function putProjectInvite(_ref3) {
  var projectId = _ref3.projectId,
      inviteId = _ref3.inviteId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/project/".concat(projectId, "/invite/").concat(inviteId, "/"),
    apiId: 'api_project_invite_update',
    requiredParams: ['projectId', 'inviteId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projectInvites.byId", data);
    newState = newState.setInPath("projectObjects.requiresReload", true);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "ui.projectObjects.byId.".concat(projectId, ".invites.byId.").concat(inviteId, ".SHOW_FORM"),
      formObjPath: "ui.projectObjects.byId.".concat(projectId, ".invites.byId.").concat(inviteId, ".newItem")
    }
  };
};

exports.putProjectInvite = putProjectInvite;

var deleteProjectInvite = function deleteProjectInvite(_ref4) {
  var projectId = _ref4.projectId,
      inviteId = _ref4.inviteId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/project/".concat(projectId, "/invite/").concat(inviteId, "/"),
    apiId: 'api_project_invite_delete',
    requiredParams: ['projectId', 'inviteId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state;

    if (!data.errors) {
      newState = newState.deleteIn("projectObjects.byId.".concat(projectId, ".invites.").concat(inviteId).split('.'));
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

exports.deleteProjectInvite = deleteProjectInvite;

var getAllProjectInvites = function getAllProjectInvites() {
  var fetchParams = {
    method: 'GET',
    url: "/api/project/invite/",
    apiId: 'api_project_invite_all_list',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projectInvites.byId", data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getAllProjectInvites = getAllProjectInvites;