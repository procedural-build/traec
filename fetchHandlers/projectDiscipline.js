"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteDiscipline = exports.putDiscipline = exports.postDiscipline = exports.getDisciplines = void 0;

var getDisciplines = function getDisciplines(_ref) {
  var projectId = _ref.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/discipline/"),
    apiId: 'api_project_discipline_list',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict("projectObjects.byId.".concat(projectId, ".disciplines"), data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getDisciplines = getDisciplines;

var postDiscipline = function postDiscipline(_ref2) {
  var projectId = _ref2.projectId;
  var fetchParams = {
    method: 'POST',
    url: "/api/project/".concat(projectId, "/discipline/"),
    apiId: 'api_project_discipline_create',
    requiredParams: ['projectId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("projectObjects.byId.".concat(projectId, ".disciplines"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "ui.projectObjects.byId.".concat(projectId, ".disciplines.SHOW_FORM"),
      formObjPath: "ui.projectObjects.byId.".concat(projectId, ".disciplines.newItem")
    }
  };
};

exports.postDiscipline = postDiscipline;

var putDiscipline = function putDiscipline(_ref3) {
  var projectId = _ref3.projectId,
      projectDisciplineId = _ref3.projectDisciplineId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/project/".concat(projectId, "/discipline/").concat(projectDisciplineId, "/"),
    apiId: 'api_project_discipline_update',
    requiredParams: ['projectId', 'projectDisciplineId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("projectObjects.byId.".concat(projectId, ".disciplines"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "ui.projectObjects.byId.".concat(projectId, ".disciplines.editbyId.").concat(projectDisciplineId, ".SHOW_FORM"),
      formObjPath: "ui.projectObjects.byId.".concat(projectId, ".disciplines.editbyId.").concat(projectDisciplineId, ".newItem")
    }
  };
};

exports.putDiscipline = putDiscipline;

var deleteDiscipline = function deleteDiscipline(_ref4) {
  var projectId = _ref4.projectId,
      projectDisciplineId = _ref4.projectDisciplineId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/project/".concat(projectId, "/discipline/").concat(projectDisciplineId, "/"),
    apiId: 'api_project_discipline_delete',
    requiredParams: ['projectId', 'projectDisciplineId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state;

    if (!data.errors) {
      newState = newState.deleteIn("projectObjects.byId.".concat(projectId, ".disciplines.").concat(projectDisciplineId).split('.'));
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

exports.deleteDiscipline = deleteDiscipline;