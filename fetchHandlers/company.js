"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCompany = exports.putCompany = exports.postCompany = exports.getCompany = exports.getCompanies = void 0;

var getCompanies = function getCompanies() {
  var fetchParams = {
    method: 'GET',
    url: "/api/company/",
    apiId: 'api_company_list',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("companies.byId", data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanies = getCompanies;

var getCompany = function getCompany(_ref) {
  var companyId = _ref.companyId;
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/"),
    apiId: 'api_company_read',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addToDict("companies.byId", data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompany = getCompany;

var postCompany = function postCompany() {
  var fetchParams = {
    method: 'POST',
    url: "/api/company/",
    apiId: 'api_company_create',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict('companies.byId', data);
      newState = newState.setInPath(formVisPath, false);
    } // Add a to the parent list of childids


    var parentId = data.parentid;

    if (parentId) {
      newState = newState.addListToSet("companies.byId.".concat(parentId, ".childids"), [data.uid]);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "companies.SHOW_FORM",
      formObjPath: "companies.newItem"
    }
  };
};

exports.postCompany = postCompany;

var putCompany = function putCompany(_ref2) {
  var companyId = _ref2.companyId;

  var _postCompany = postCompany(),
      fetchParams = _postCompany.fetchParams,
      stateParams = _postCompany.stateParams;

  Object.assign(fetchParams, {
    method: 'PUT',
    url: "/api/company/".concat(companyId, "/"),
    apiId: 'api_company_update',
    requiredParams: ['companyId']
  });
  Object.assign(stateParams, {
    formVisPath: "companies.editById.".concat(companyId, ".SHOW_FORM"),
    formObjPath: "companies.editById.".concat(companyId, ".newItem")
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.putCompany = putCompany;

var deleteCompany = function deleteCompany(_ref3) {
  var companyId = _ref3.companyId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/company/".concat(companyId, "/"),
    apiId: 'api_company_delete',
    requiredParams: ['companyId'],
    // Deleting a Company can affect so many things that its
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

exports.deleteCompany = deleteCompany;