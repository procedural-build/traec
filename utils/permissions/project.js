"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectPermissionFilter = exports.projectPermissionRender = exports.permissionWarning = exports.projectPermissionCheck = exports.getProjectPermissions = exports.fetchProjectUserPermissions = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _store = _interopRequireDefault(require("traec/redux/store"));

var fetchHandlers = _interopRequireWildcard(require("traec/fetchHandlers"));

var _actionCreators = require("traec/redux/actionCreators");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fetchProjectUserPermissions = function fetchProjectUserPermissions(projectId) {
  var params = fetchHandlers.getProjectUserPermissions({
    projectId: projectId
  });

  _store["default"].dispatch((0, _actionCreators.fetchToState)(params));
};

exports.fetchProjectUserPermissions = fetchProjectUserPermissions;

var getProjectPermissions = function getProjectPermissions(state, projectId) {
  return state.getInPath("entities.projectObjects.byId.".concat(projectId, ".userPermission"));
};

exports.getProjectPermissions = getProjectPermissions;

var projectPermissionCheck = function projectPermissionCheck(projectId, requiresAdmin, requiredActions) {
  var allow_fetch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var state = _store["default"].getState(); // Check if we have the permissions object or fetch it


  var permissions = getProjectPermissions(state, projectId); // Return null if the permissions are not found

  if (!permissions) {
    if (projectId && allow_fetch) {
      fetchProjectUserPermissions(projectId);
    }

    return null;
  } // First check the user permissions for superuser status


  if (state.getInPath('auth.user.is_tenant_superuser')) {
    return true;
  } // Handle an admin-type user first


  var isAdmin = permissions.get('is_admin');

  if (requiresAdmin) {
    if (isAdmin) {
      return true;
    } else {
      return false;
    }
  } else {
    // If admin is not required but the user
    // is an admin then they can do anything
    if (isAdmin) {
      return true;
    }
  } // Check against the list (actually Immutable.Set) of actions that the user has for this project


  var allowedActions = permissions.get('actions');

  var requiredActionSet = _immutable["default"].Set(requiredActions);

  var intersectActions = requiredActionSet.intersect(allowedActions);

  if (intersectActions.size == requiredActionSet.size) {
    return true;
  } else {
    return false;
  }
};

exports.projectPermissionCheck = projectPermissionCheck;

var permissionWarning = _react["default"].createElement("div", {
  className: "alert alert-warning"
}, _react["default"].createElement("strong", null, "PermissionDenied"), " You do not have permission to view this content.  Please contact the project admin to ensure that you are assigned an appropriate role.");

exports.permissionWarning = permissionWarning;

var permisionOjectWarning = _react["default"].createElement("p", null, "No user permissions found for this Project.  Please contact the project admin to ensure you have permissions to view this Project");

var projectPermissionRender = function projectPermissionRender(projectId, requiresAdmin, requiredActions, renderContent) {
  var showWarning = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var hasPermission = projectPermissionCheck(projectId, requiresAdmin, requiredActions, false);

  if (hasPermission === null) {
    if (showWarning) {
      return permissionWarning;
    } else {
      return null;
    }
  }

  if (hasPermission) {
    return renderContent;
  } else {
    if (showWarning) {
      return permissionWarning;
    } else {
      return null;
    }
  }
};

exports.projectPermissionRender = projectPermissionRender;

var projectPermissionFilter = function projectPermissionFilter(projectId, items) {
  var state = _store["default"].getState();

  var permissions = getProjectPermissions(state, projectId);

  if (!permissions) {
    return null;
  } // Filter the items


  items = items.filter(function (i) {
    if (i.requiresAdmin != null || i.requiredActions != null) {
      var requiresAdmin = i.requiresAdmin || false;
      var requiredActions = i.requiredActions || [];
      return projectPermissionCheck(projectId, requiresAdmin, requiredActions);
    }

    return true;
  });
  return items;
};

exports.projectPermissionFilter = projectPermissionFilter;