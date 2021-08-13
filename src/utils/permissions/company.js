import Im from "immutable";
import React from "react";
import store from "../../redux/store";
import * as fetchHandlers from "../../fetchHandlers";
import { fetchToState } from "../../redux/actionCreators";

/**
 * Utilities for checking and getting **company** permissions
 * @namespace company
 * @memberof utils.permissions
 */

/**
 * Fetch company user permissions
 * @memberof utils.permissions.company
 * @param  companyId
 */
export const fetchCompanyUserPermissions = function (companyId) {
  let params = fetchHandlers.getCompanyUserPermissions({ companyId });
  store.dispatch(fetchToState(params));
};

/**
 * Get user permissions of a company by ID
 * @memberof utils.permissions.company
 * @param  state
 * @param  companyId
 */
export const getCompanyPermissions = function (state, companyId) {
  return state.getInPath(`entities.companyObjects.byId.${companyId}.userPermission`);
};

/**
 * Check the permissions for a company by ID
 * @memberof utils.permissions.company
 * @param  companyId
 * @param  requiresAdmin
 * @param  requiredActions
 * @param  allow_fetch
 */
export const companyPermissionCheck = function (companyId, requiresAdmin, requiredActions, allow_fetch = true) {
  let state = store.getState();

  // Check if we have the permission object or fetch it
  let permissions = getCompanyPermissions(state, companyId);

  // Return null if the permissions are not found
  if (!permissions) {
    if (companyId && allow_fetch) {
      fetchCompanyUserPermissions(companyId);
    }
    return null;
  }

  // First check the user permissions for superuser status
  if (state.getInPath("auth.user.is_tenant_superuser")) {
    return true;
  }

  // Handle an admin-type user first
  let isAdmin = permissions.get("is_admin");
  if (requiresAdmin) {
    return !!isAdmin;
  } else {
    // If admin is not required but the user
    // is an admin then they can do anything
    if (isAdmin) {
      return true;
    }
  }
  // Check against the list (actually Immutable.Set) of actions that the user has for this company
  let allowedActions = permissions.get("actions");
  let requiredActionSet = Im.Set(requiredActions);
  let intersectActions = requiredActionSet.intersect(allowedActions);
  return intersectActions.size === requiredActionSet.size;
};

export function CompanyWarning() {
  return (
    <div className="alert alert-warning">
      <strong>Permission Denied</strong> You do not have permission to view this content. Please contact the project
      admin to ensure that you are assigned an appropriate role.
    </div>
  );
}

export function CompanyObjectWarning() {
  return (
    <p>
      No user permissions found for this Company. Please contact the project admin to ensure you have permissions to
      view this Company
    </p>
  );
}

export function CompanyPermission({
  children,
  companyId,
  requiresAdmin,
  requiredActions = [],
  showWarning = false,
  warning,
}) {
  let permission = companyPermissionCheck(companyId, requiresAdmin, requiredActions, false)
  if (permission === false) {
    return showWarning ? warning || <CompanyWarning /> : null;
  }
  else if (!permission){
    return null
  }
  return children;
}

/**
 * company.js line 116
 * @memberof utils.permissions.company
 * @param  companyId
 * @param  items
 */
export const companyPermissionFilter = function (companyId, items) {
  let state = store.getState();
  let permissions = getCompanyPermissions(state, companyId);

  if (!permissions) {
    return null;
  }

  // Filter the items
  items = items.filter((i) => {
    if (i.requiresAdmin != null || i.requiredActions != null) {
      let requiresAdmin = i.requiresAdmin || false;
      let requiredActions = i.requiredActions || [];
      return companyPermissionCheck(companyId, requiresAdmin, requiredActions);
    }
    return true;
  });
  return items;
};
