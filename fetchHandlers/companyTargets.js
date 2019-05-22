"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putCompanyTarget = exports.postCompanyTarget = exports.getCompanyTargets = void 0;

var getCompanyTargets = function getCompanyTargets(_ref) {
  var companyId = _ref.companyId;
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/target/"),
    apiId: 'api_company_target_list',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var path = "companyObjects.byId.".concat(companyId, ".targets");
    var newState = state.addListToDict(path, data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyTargets = getCompanyTargets;

var postCompanyTarget = function postCompanyTarget(_ref2) {
  var companyId = _ref2.companyId;
  var fetchParams = {
    method: 'POST',
    url: "/api/company/".concat(companyId, "/target/"),
    apiId: 'api_company_target_create',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var path = "companyObjects.byId.".concat(companyId, ".targets");
    var newState = state.addListToDict(path, data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postCompanyTarget = postCompanyTarget;

var putCompanyTarget = function putCompanyTarget(_ref3) {
  var companyId = _ref3.companyId,
      metricTargetId = _ref3.metricTargetId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/company/".concat(companyId, "/target/").concat(metricTargetId, "/"),
    apiId: 'api_company_target_update',
    requiredParams: ['companyId', 'metricTargetId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var path = "companyObjects.byId.".concat(companyId, ".targets");
    var newState = state.addListToDict(path, [data]);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.putCompanyTarget = putCompanyTarget;