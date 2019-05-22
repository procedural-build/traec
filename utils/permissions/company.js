"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.companyPermissionFilter = exports.companyPermissionRender = exports.companyPermissionCheck = exports.getCompanyPermissions = exports.fetchCompanyUserPermissions = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _store = _interopRequireDefault(require("traec/redux/store"));

var fetchHandlers = _interopRequireWildcard(require("traec/fetchHandlers"));

var _actionCreators = require("traec/redux/actionCreators");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fetchCompanyUserPermissions = function fetchCompanyUserPermissions(companyId) {
  var params = fetchHandlers.getCompanyUserPermissions({
    companyId: companyId
  });

  _store["default"].dispatch((0, _actionCreators.fetchToState)(params));
};

exports.fetchCompanyUserPermissions = fetchCompanyUserPermissions;

var getCompanyPermissions = function getCompanyPermissions(state, companyId) {
  return state.getInPath("entities.companyObjects.byId.".concat(companyId, ".userPermission"));
};

exports.getCompanyPermissions = getCompanyPermissions;

var companyPermissionCheck = function companyPermissionCheck(companyId, requiresAdmin, requiredActions) {
  var allow_fetch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var state = _store["default"].getState(); // Check if we have the permission object or fetch it


  var permissions = getCompanyPermissions(state, companyId); // Return null if the permissions are not found

  if (!permissions) {
    //let path = `entities.companyObjects.byId.${companyId}.userPermission`
    //console.log(permissions, path, state.getInPath(path), state.toJS())
    if (companyId && allow_fetch) {
      fetchCompanyUserPermissions(companyId);
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
  } // Check against the list (actually Immutable.Set) of actions that the user has for this company


  var allowedActions = permissions.get('actions');

  var requiredActionSet = _immutable["default"].Set(requiredActions);

  var intersectActions = requiredActionSet.intersect(allowedActions);

  if (intersectActions.size == requiredActionSet.size) {
    return true;
  } else {
    return false;
  }
};

exports.companyPermissionCheck = companyPermissionCheck;

var companyPermissionRender = function companyPermissionRender(companyId, requiresAdmin, requiredActions, renderContent) {
  var showWarning = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var hasPermission = companyPermissionCheck(companyId, requiresAdmin, requiredActions, false);

  if (hasPermission === null) {
    if (showWarning) {
      return _react["default"].createElement("p", null, "No user permissions found for this Company.  Please contact the project admin to ensure you have permissions to view this Company");
    } else {
      return null;
    }
  }

  if (hasPermission) {
    return renderContent;
  } else {
    if (showWarning) {
      return _react["default"].createElement("div", {
        className: "alert alert-warning"
      }, _react["default"].createElement("strong", null, "PermissionDenied"), " You do not have permission to view this content.  Please contact the project admin to ensure that you are assigned an appropriate role.");
    } else {
      return null;
    }
  }
};

exports.companyPermissionRender = companyPermissionRender;

var companyPermissionFilter = function companyPermissionFilter(companyId, items) {
  var state = _store["default"].getState();

  var permissions = getCompanyPermissions(state, companyId);

  if (!permissions) {
    return null;
  } // Filter the items


  items = items.filter(function (i) {
    if (i.requiresAdmin != null || i.requiredActions != null) {
      var requiresAdmin = i.requiresAdmin || false;
      var requiredActions = i.requiredActions || [];
      return companyPermissionCheck(companyId, requiresAdmin, requiredActions);
    }

    return true;
  });
  return items;
};

exports.companyPermissionFilter = companyPermissionFilter;