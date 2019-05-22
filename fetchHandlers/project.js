"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProject = exports.getProject = exports.patchProject = exports.putProject = exports.postProject = exports.getProjects = void 0;

var _immutable = _interopRequireDefault(require("traec/immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getProjects = function getProjects() {
  var fetchParams = {
    method: 'GET',
    url: "/api/project/",
    apiId: 'api_project_list',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projects.byId", data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjects = getProjects;

var postProject = function postProject() {
  var fetchParams = {
    method: 'POST',
    url: "/api/project/",
    apiId: 'api_project_create',
    requiredParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict('projects.byId', data); // Add the project uid and name to the parent company (if it exists)

      if (data.company) {
        newState = newState.addListToSet("companies.byId.".concat(data.company.uid, ".projects"), [_immutable["default"].fromJS({
          uid: data.uid,
          name: data.name
        })]);
      }

      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "projects.SHOW_FORM",
      formObjPath: "projects.newItem"
    }
  };
};

exports.postProject = postProject;

var putProject = function putProject(_ref) {
  var projectId = _ref.projectId;
  var params = postProject();
  Object.assign(params.fetchParams, {
    method: 'PUT',
    url: "/api/project/".concat(projectId, "/"),
    apiId: 'api_project_update',
    requiredParams: ['projectId']
  });
  Object.assign(params.stateParams, {
    formVisPath: "projects.editById.".concat(projectId, ".SHOW_FORM"),
    formObjPath: "projects.editById.".concat(projectId, ".newItem")
  });
  return params;
};

exports.putProject = putProject;

var patchProject = function patchProject(_ref2) {
  var projectId = _ref2.projectId;
  var params = putProject({
    projectId: projectId
  });
  Object.assign(params.fetchParams, {
    method: 'PATCH',
    apiId: 'api_project_partial_update'
  });
  return params;
};

exports.patchProject = patchProject;

var getProject = function getProject(_ref3) {
  var projectId = _ref3.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/"),
    apiId: 'api_project_read',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addToDict('projects.byId', data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProject = getProject;

var deleteProject = function deleteProject(_ref4) {
  var projectId = _ref4.projectId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/project/".concat(projectId, "/"),
    apiId: 'api_project_delete',
    requiredParams: ['projectId'],
    // Deleting a Project can affect so many things that its
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

exports.deleteProject = deleteProject;