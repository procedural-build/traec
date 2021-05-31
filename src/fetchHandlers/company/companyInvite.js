export const getCompanyInvites = ({ companyId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/invite/`,
    apiId: "api_company_invite_list",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`companyObjects.byId.${companyId}.invites`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCompanyInvite = ({ companyId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/company/${companyId}/invite/`,
    apiId: "api_company_invite_create",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict(`companyObjects.byId.${companyId}.invites`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `companies.byId.${companyId}.SHOW_INVITE_FORM`,
      formObjPath: `companies.byId.${companyId}.newItem`
    }
  };
};

export const putCompanyInvite = ({ companyId, inviteId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/company/${companyId}/invite/${inviteId}/`,
    apiId: "api_company_invite_update",
    requiredParams: ["companyId", "inviteId"],
    postSuccessHook: () => {
      location.reload();
    }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addToDict(`companyObjects.byId.${companyId}.invites`, data);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `companies.byId.${companyId}.edit.SHOW_INVITE_FORM`,
      formObjPath: `companies.byId.${companyId}.edit.inviteItem`
    }
  };
};

export const patchCompanyInvite = ({ companyId, inviteId }) => {
  let { fetchParams, stateParams } = putCompanyInvite({ companyId, inviteId });
  Object.assign(fetchParams, { method: "PATCH" });
  return { fetchParams, stateParams };
};

export const deleteCompanyInvite = ({ companyId, inviteId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/company/${companyId}/invite/${inviteId}/`,
    apiId: "api_company_invite_delete",
    requiredParams: ["companyId", "inviteId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    if (!data.errors) {
      newState = newState.deleteIn(`companyObjects.byId.${companyId}.invites.${inviteId}`.split("."));
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getAllCompanyInvites = () => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/invite/`,
    apiId: "api_company_invite_all_list",
    requiredParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`companyInvites.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCompanyRequest = ({ companyId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/company/invite/`,
    apiId: "api_company_invite_all_create",
    requiredParams: [],
    body: {
      company: { uid: companyId },
      is_request: true
    }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`companyInvites.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putUserCompanyInvite = ({ companyId, inviteId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/company/invite/${inviteId}/`,
    apiId: "api_company_invite_all_update",
    requiredParams: ["inviteId"],
    postSuccessHook: () => {
      location.reload();
    }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addToDict(`companyObjects.byId.${companyId}.invites`, data);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `companies.byId.${companyId}.edit.SHOW_INVITE_FORM`,
      formObjPath: `companies.byId.${companyId}.edit.inviteItem`
    }
  };
};

export const patchUserCompanyInvite = ({ companyId, inviteId }) => {
  let { fetchParams, stateParams } = putUserCompanyInvite({ companyId, inviteId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_company_invite_all_partial_update"
  });
  return { fetchParams, stateParams };
};

export const deleteCompanyRequest = ({ inviteId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/company/invite/${inviteId}/`,
    apiId: "api_company_invite_all_delete",
    requiredParams: ["inviteId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    if (!data.errors) {
      return state.removeInPath(`companyInvites.byId.${inviteId}`);
    }
    return state;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
