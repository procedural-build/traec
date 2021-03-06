import Im, { Map } from "immutable";
import React from "react";
import store from "../../redux/store";
import * as fetchHandlers from "../../fetchHandlers";
import { fetchToState } from "../../redux/actionCreators";

/**
 * Utilities for checking and getting **project** permissions
 * @namespace project
 * @memberof utils.permissions
 */

/**
 * Fetch user permissions for a project by ID, and dispatches an action to update the redux store's state.
 * @memberof utils.permissions.project
 * @param { String } projectId - The id of the project
 */
export const fetchProjectUserPermissions = function (projectId) {
  let params = fetchHandlers.getProjectUserPermissions({ projectId });
  store.dispatch(fetchToState(params));
};

/**
 * Get permissions of a project by ID.
 * @memberof utils.permissions.project
 * @param   { Map } state - The state of the redux store.
 * @param   { String } projectId - The id of the project.
 * @returns { Map } - An immutable map object containing the user permissions fetched from the state.
 */
export const getProjectPermissions = function (state, projectId) {
  return state.getInPath(`entities.projectObjects.byId.${projectId}.userPermission`);
};

/**
 * Checks if the user has permission to see the project, based on value of requiresAdmin and requiresActions.
 * If the permissions aren't in the store it will fetch them if allow_fetch = true. *
 *
 * @memberof utils.permissions.project
 * @param  { String } projectId - The id of the project
 * @param  { boolean } requiresAdmin - Specifies if the user has to be admin to have permissions.
 * @param  { String[] } requiredActions - Lists the actions the user is required to have.
 * @param  { boolean } allow_fetch - Allows the method to fetch the user permissions.
 * @return { (boolean | null) } - True if the user has permission to the project, otherwise false. Null if no permissions are found.
 */
export const projectPermissionCheck = function (projectId, requiresAdmin, requiredActions, allow_fetch = true) {
  let state = store.getState();

  // Check if we have the permissions object or fetch it
  let permissions = getProjectPermissions(state, projectId);
  // Return null if the permissions are not found
  if (!permissions) {
    if (projectId && allow_fetch) {
      fetchProjectUserPermissions(projectId);
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
  // Check against the list (actually Immutable.Set) of actions that the user has for this project
  let allowedActions = permissions.get("actions");
  let requiredActionSet = Im.Set(requiredActions);
  let intersectActions = requiredActionSet.intersect(allowedActions);
  if (intersectActions.size === requiredActionSet.size) {
    return true;
  } else {
    return false;
  }
};

export function PermissionWarning(props) {
  return (
    <div className="alert alert-warning">
      <strong>PermissionDenied</strong> You do not have permission to view this content. Please contact the project
      admin to ensure that you are assigned an appropriate role.
    </div>
  );
}

export function PermissionObjectWarning() {
  return (
    <p>
      No user permissions found for this Project. Please contact the project admin to ensure you have permissions to
      view this Project
    </p>
  );
}

export function ProjectPermission({
  children,
  projectId,
  requiresAdmin,
  requiredActions = [],
  showWarning = false,
  warning,
}) {
  if (!projectPermissionCheck(projectId, requiresAdmin, requiredActions, false)) {
    return showWarning ? warning || <PermissionWarning /> : null;
  }
  return children;
}

/**
 * project.js line 114
 * Filters an array of objects, based on the permissions the user has to the given project id.
 *
 * @memberof utils.permissions.project
 * @param   { string } projectId - The id of the project.
 * @param   { Object[] } items - The array of objects that will be filterd (See how it can be structured below).
 * @returns { (Object[] | null) } - The items array exluding objects which the user doesn't have permission for or null if the user doesn't have permissions for the project id.
 *
 * @example
 * let projectId = "DJFJEU2467DEKGI346234DG"
 * let items = [
 *        {
 *          label: "Test Item 1",
 *          requiresAdmin: true,    // Only admins have access to this object.
 *          requiredActions: []
 *        },
 *        {
 *          label: "Test Item 2",
 *          requiresAdmin: false     // Only users who are allowed to write to the project (given by the projectId), have access to this object.
 *          requiredActions: ["write"]
 *        },
 *        {
 *          label: "Test Item 3"    // All users have access to this object.
 *        }
 * ]
 *
 * let filteredItems = projectPermissionFilter(projectId, items)
 *
 * /* If the user is admin:
 * filteredItems = [
 *        {
 *          label: "Test Item 1",
 *          requiresAdmin: true,
 *          requiredActions: []
 *        },
 *        {
 *          label: "Test Item 2",
 *          requiresAdmin: false,
 *          requiredActions: ["write"]
 *        },
 *        {
 *          label: "Test Item 3"
 *        }
 * ]
 *
 * /* If the user is NOT admin but has 'write' permissions:
 * filteredItems = [
 *        {
 *          label: "Test Item 2",
 *          requiresAdmin: false,
 *          requiredActions: ["write"]
 *        },
 *        {
 *          label: "Test Item 3"
 *        }
 * ]
 * /* If the user is NOT admin and doesn't have 'write' permissions:
 * flteredItems = [
 *        {
 *          label: "Test Item 3"
 *        }
 * ]
 *
 */
export const projectPermissionFilter = function (projectId, items) {
  let state = store.getState();
  let permissions = getProjectPermissions(state, projectId);
  if (!permissions) {
    return null;
  }
  // Filter the items
  items = items.filter((i) => {
    if (i.requiresAdmin != null || i.requiredActions != null) {
      let requiresAdmin = i.requiresAdmin || false;
      let requiredActions = i.requiredActions || [];
      return projectPermissionCheck(projectId, requiresAdmin, requiredActions);
    }
    return true;
  });
  return items;
};
