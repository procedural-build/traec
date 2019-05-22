"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjectUserPermissions = exports.patchProjectAuthGroup = exports.putProjectAuthGroup = exports.postProjectAuthGroup = exports.getProjectAuthGroups = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getProjectAuthGroups = function getProjectAuthGroups(_ref) {
  var projectId = _ref.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/authgroup/"),
    apiId: 'api_project_authgroup_list',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projectObjects.byId.".concat(projectId, ".authgroups"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjectAuthGroups = getProjectAuthGroups;

var postProjectAuthGroup = function postProjectAuthGroup(_ref2) {
  var projectId = _ref2.projectId;
  var fetchParams = {
    method: 'POST',
    url: "/api/project/".concat(projectId, "/authgroup/"),
    apiId: 'api_project_authgroup_create',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("projectObjects.byId.".concat(projectId, ".authgroups"), data);
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

exports.postProjectAuthGroup = postProjectAuthGroup;

var putProjectAuthGroup = function putProjectAuthGroup(_ref3) {
  var projectId = _ref3.projectId,
      authGroupId = _ref3.authGroupId;

  var _postProjectAuthGroup = postProjectAuthGroup({
    projectId: projectId
  }),
      fetchParams = _postProjectAuthGroup.fetchParams,
      stateParams = _postProjectAuthGroup.stateParams;

  fetchParams = {
    method: 'PUT',
    url: "/api/project/".concat(projectId, "/authgroup/").concat(authGroupId, "/"),
    apiId: 'api_project_authgroup_update',
    requiredParams: ['projectId', 'authGroupId'] // Reuse the same stateParams as from the post

  };
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.putProjectAuthGroup = putProjectAuthGroup;

var patchProjectAuthGroup = function patchProjectAuthGroup(_ref4) {
  var projectId = _ref4.projectId,
      authGroupId = _ref4.authGroupId;

  var _putProjectAuthGroup = putProjectAuthGroup({
    projectId: projectId,
    authGroupId: authGroupId
  }),
      fetchParams = _putProjectAuthGroup.fetchParams,
      stateParams = _putProjectAuthGroup.stateParams; // Same as PUI, we are only changing the method


  Object.assign(fetchParams, {
    method: 'PATCH'
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.patchProjectAuthGroup = patchProjectAuthGroup;

var getProjectUserPermissions = function getProjectUserPermissions(_ref5) {
  var projectId = _ref5.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/permission/"),
    apiId: 'api_project_permission_list',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.setInPath("projectObjects.byId.".concat(projectId, ".userPermission"), data);
    newState = newState.setInPath("projectObjects.byId.".concat(projectId, ".userPermission.actions"), _immutable["default"].Set(data.actions)); // Set project_discipline_ids and base_discipline_ids (helpers to avoid doing this repeatedly later)

    newState = newState.setInPath("projectObjects.byId.".concat(projectId, ".userPermission.projectDisciplineIds"), _immutable["default"].Set(data.project_disciplines.map(function (i) {
      return i.uid;
    })));
    newState = newState.setInPath("projectObjects.byId.".concat(projectId, ".userPermission.baseDisciplineIds"), _immutable["default"].Set(data.project_disciplines.map(function (i) {
      return i.base_uid;
    })));
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjectUserPermissions = getProjectUserPermissions;