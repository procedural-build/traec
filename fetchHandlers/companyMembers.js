"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCompanyMember = exports.getCompanyMembers = void 0;

var getCompanyMembers = function getCompanyMembers(_ref) {
  var companyId = _ref.companyId;
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/member/"),
    apiId: 'api_company_member_list',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("companyObjects.byId.".concat(companyId, ".members"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyMembers = getCompanyMembers;

var deleteCompanyMember = function deleteCompanyMember(_ref2) {
  var companyId = _ref2.companyId,
      memberId = _ref2.memberId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/company/".concat(companyId, "/member/").concat(memberId, "/"),
    apiId: 'api_company_member_delete',
    requiredParams: ['companyId', 'memberId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return state.removeInPath("companyObjects.byId.".concat(companyId, ".members.").concat(memberId));
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteCompanyMember = deleteCompanyMember;