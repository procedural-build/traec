import Im from "immutable";

export const getCompanyAuthGroups = ({ companyId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/authgroup/`,
    apiId: "api_company_authgroup_list",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`companyObjects.byId.${companyId}.authGroups`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCompanyAuthGroup = ({ companyId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/company/${companyId}/authgroup/`,
    apiId: "api_company_authgroup_create",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict(`companyObjects.byId.${companyId}.authGroups`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `ui.companyObjects.byId.${companyId}.authGroups.SHOW_FORM`,
      formObjPath: `ui.companyObjects.byId.${companyId}.authGroups.newItem`
    }
  };
};

export const putCompanyAuthGroup = ({ companyId, authGroupId }) => {
  let { fetchParams, stateParams } = postCompanyAuthGroup({ companyId });
  fetchParams = {
    method: "PUT",
    url: `/api/company/${companyId}/authgroup/${authGroupId}/`,
    apiId: "api_company_authgroup_update",
    requiredParams: ["companyId", "authGroupId"]
  };
  // Reuse the same stateParams as from the post
  Object.assign(stateParams, {
    formVisPath: `ui.companyObjects.byId.${companyId}.authGroups.${authGroupId}.SHOW_FORM`,
    formObjPath: `ui.companyObjects.byId.${companyId}.authGroups.${authGroupId}.newItem`
  });
  return { fetchParams, stateParams };
};

export const patchCompanyAuthGroup = ({ companyId, authGroupId }) => {
  let { fetchParams, stateParams } = putCompanyAuthGroup({ companyId, authGroupId });
  // Same as PUI, we are only changing the method
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_company_authgroup_partial_update"
  });
  return { fetchParams, stateParams };
};

export const deleteCompanyAuthGroup = ({ companyId, authGroupId }) => {
  let { fetchParams, stateParams } = putCompanyAuthGroup({ companyId, authGroupId });
  // Same as PUI, we are only changing the method
  Object.assign(fetchParams, {
    method: "DELETE",
    apiId: "api_company_authgroup_delete"
  });
  Object.assign(stateParams, { stateSetFunc: (state, action) => state });
  return { fetchParams, stateParams };
};

export const getCompanyUserPermissions = ({ companyId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/permission/`,
    apiId: "api_company_permission_list",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.setInPath(`companyObjects.byId.${companyId}.userPermission`, data);
    newState = newState.setInPath(`companyObjects.byId.${companyId}.userPermission.actions`, Im.Set(data.actions));
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
