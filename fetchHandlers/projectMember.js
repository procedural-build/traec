"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProjectMember = exports.getProjectMembers = void 0;

var getProjectMembers = function getProjectMembers(_ref) {
  var projectId = _ref.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/member/"),
    apiId: 'api_project_member_list',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projectObjects.byId.".concat(projectId, ".members"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjectMembers = getProjectMembers;

var deleteProjectMember = function deleteProjectMember(_ref2) {
  var projectId = _ref2.projectId,
      memberId = _ref2.memberId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/project/".concat(projectId, "/member/").concat(memberId, "/"),
    apiId: 'api_project_member_delete',
    requiredParams: ['projectId', 'memberId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.removeInPath("projectObjects.byId.".concat(projectId, ".members.").concat(memberId));
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteProjectMember = deleteProjectMember;