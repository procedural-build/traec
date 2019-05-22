"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompanyUserPermissions = exports.patchCompanyAuthGroup = exports.putCompanyAuthGroup = exports.postCompanyAuthGroup = exports.getCompanyAuthGroups = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getCompanyAuthGroups = function getCompanyAuthGroups(_ref) {
  var companyId = _ref.companyId;
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/authgroup/"),
    apiId: 'api_company_authgroup_list',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("companyObjects.byId.".concat(companyId, ".authgroups"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyAuthGroups = getCompanyAuthGroups;

var postCompanyAuthGroup = function postCompanyAuthGroup(_ref2) {
  var companyId = _ref2.companyId;
  var fetchParams = {
    method: 'POST',
    url: "/api/company/".concat(companyId, "/authgroup/"),
    apiId: 'api_company_authgroup_create',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("companyObjects.byId.".concat(companyId, ".authgroups"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "ui.companyObjects.byId.".concat(companyId, ".authGroups.SHOW_FORM"),
      formObjPath: "ui.companyObjects.byId.".concat(companyId, ".authGroups.newItem")
    }
  };
};

exports.postCompanyAuthGroup = postCompanyAuthGroup;

var putCompanyAuthGroup = function putCompanyAuthGroup(_ref3) {
  var companyId = _ref3.companyId,
      authGroupId = _ref3.authGroupId;

  var _postCompanyAuthGroup = postCompanyAuthGroup({
    companyId: companyId
  }),
      fetchParams = _postCompanyAuthGroup.fetchParams,
      stateParams = _postCompanyAuthGroup.stateParams;

  fetchParams = {
    method: 'PUT',
    url: "/api/company/".concat(companyId, "/authgroup/").concat(authGroupId, "/"),
    apiId: 'api_company_authgroup_update',
    requiredParams: ['companyId', 'authGroupId'] // Reuse the same stateParams as from the post

  };
  Object.assign(stateParams, {
    formVisPath: "ui.companyObjects.byId.".concat(companyId, ".authGroups.").concat(authGroupId, ".SHOW_FORM"),
    formObjPath: "ui.companyObjects.byId.".concat(companyId, ".authGroups.").concat(authGroupId, ".newItem")
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.putCompanyAuthGroup = putCompanyAuthGroup;

var patchCompanyAuthGroup = function patchCompanyAuthGroup(_ref4) {
  var companyId = _ref4.companyId,
      authGroupId = _ref4.authGroupId;

  var _putCompanyAuthGroup = putCompanyAuthGroup({
    companyId: companyId,
    authGroupId: authGroupId
  }),
      fetchParams = _putCompanyAuthGroup.fetchParams,
      stateParams = _putCompanyAuthGroup.stateParams; // Same as PUI, we are only changing the method


  Object.assign(fetchParams, {
    method: 'PATCH'
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.patchCompanyAuthGroup = patchCompanyAuthGroup;

var getCompanyUserPermissions = function getCompanyUserPermissions(_ref5) {
  var companyId = _ref5.companyId;
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/permission/"),
    apiId: 'api_company_permission_list',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.setInPath("companyObjects.byId.".concat(companyId, ".userPermission"), data);
    newState = newState.setInPath("companyObjects.byId.".concat(companyId, ".userPermission.actions"), _immutable["default"].Set(data.actions));
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyUserPermissions = getCompanyUserPermissions;