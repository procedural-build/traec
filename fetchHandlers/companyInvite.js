"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllCompanyInvites = exports.deleteCompanyInvite = exports.patchCompanyInvite = exports.putCompanyInvite = exports.postCompanyInvite = exports.getCompanyInvites = void 0;

var getCompanyInvites = function getCompanyInvites(_ref) {
  var companyId = _ref.companyId;
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/invite/"),
    apiId: 'api_company_invite_list',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("companyObjects.byId.".concat(companyId, ".invites"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyInvites = getCompanyInvites;

var postCompanyInvite = function postCompanyInvite(_ref2) {
  var companyId = _ref2.companyId;
  var fetchParams = {
    method: 'POST',
    url: "/api/company/".concat(companyId, "/invite/"),
    apiId: 'api_company_invite_create',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("companyObjects.byId.".concat(companyId, ".invites"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "companies.byId.".concat(companyId, ".SHOW_INVITE_FORM"),
      formObjPath: "companies.byId.".concat(companyId, ".newItem")
    }
  };
};

exports.postCompanyInvite = postCompanyInvite;

var putCompanyInvite = function putCompanyInvite(_ref3) {
  var companyId = _ref3.companyId,
      inviteId = _ref3.inviteId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/company/".concat(companyId, "/invite/").concat(inviteId, "/"),
    apiId: 'api_company_invite_update',
    requiredParams: ['companyId', 'inviteId'],
    postSuccessHook: function postSuccessHook() {
      location.reload();
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return state.addToDict("companyObjects.byId.".concat(companyId, ".invites"), data);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "companies.byId.".concat(companyId, ".edit.SHOW_INVITE_FORM"),
      formObjPath: "companies.byId.".concat(companyId, ".edit.inviteItem")
    }
  };
};

exports.putCompanyInvite = putCompanyInvite;

var patchCompanyInvite = function patchCompanyInvite(_ref4) {
  var companyId = _ref4.companyId,
      inviteId = _ref4.inviteId;

  var _putCompanyInvite = putCompanyInvite({
    companyId: companyId,
    inviteId: inviteId
  }),
      fetchParams = _putCompanyInvite.fetchParams,
      stateParams = _putCompanyInvite.stateParams;

  Object.assign(fetchParams, {
    method: 'PATCH'
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.patchCompanyInvite = patchCompanyInvite;

var deleteCompanyInvite = function deleteCompanyInvite(_ref5) {
  var companyId = _ref5.companyId,
      inviteId = _ref5.inviteId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/company/".concat(companyId, "/invite/").concat(inviteId, "/"),
    apiId: 'api_company_invite_delete',
    requiredParams: ['companyId', 'inviteId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state;

    if (!data.errors) {
      newState = newState.deleteIn("companyObjects.byId.".concat(companyId, ".invites.").concat(inviteId).split('.'));
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

exports.deleteCompanyInvite = deleteCompanyInvite;

var getAllCompanyInvites = function getAllCompanyInvites() {
  var fetchParams = {
    method: 'GET',
    url: "/api/company/invite/",
    apiId: 'api_company_invite_all_list',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return state.addListToDict("companyInvites.byId", data);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getAllCompanyInvites = getAllCompanyInvites;