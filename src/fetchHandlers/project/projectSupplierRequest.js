export const getProjectSupplierRequest = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/supplier/`,
    apiId: "api_project_supplier_list",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`projectObjects.byId.${projectId}.requests`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postProjectSupplierRequest = ({ projectId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/project/${projectId}/supplier/`,
    apiId: "api_project_supplier_create",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict(`projectObjects.byId.${projectId}.requests`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `ui.projectObjects.byId.${projectId}.request.SHOW_FORM`,
      formObjPath: `ui.projectObjects.byId.${projectId}.request.newItem`
    }
  };
};

export const putProjectSupplierRequest = ({ projectId, requestId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/project/${projectId}/supplier/${requestId}/`,
    apiId: "api_project_supplier_update",
    requiredParams: ["projectId", "requestId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`projectObjects.byId.${projectId}.requests`, data);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `ui.projectObjects.byId.${projectId}.invites.byId.${requestId}.SHOW_FORM`,
      formObjPath: `ui.projectObjects.byId.${projectId}.invites.byId.${requestId}.newItem`
    }
  };
};

export const deleteProjectSupplierRequest = ({ projectId, requestId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/project/${projectId}/supplier/${requestId}/`,
    apiId: "api_project_supplier_delete",
    requiredParams: ["projectId", "requestId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    if (!data.errors) {
      newState = newState.deleteIn(`projectObjects.byId.${projectId}.request.${requestId}`.split("."));
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getAllProjectSupplierRequests = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/supplier/sent/`,
    apiId: "api_project_supplier_sent_list",
    requiredParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`projectObjects.byId.${projectId}.requests`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
