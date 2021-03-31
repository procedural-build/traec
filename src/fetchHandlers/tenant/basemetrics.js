export const getTenancyBaseMetrics = ({ companyId = null }) => {
  let query_params = companyId ? `?companyId=${companyId}` : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/basemetric/${query_params}`,
    apiId: "api_tenant_admin_basemetric_list",
    requiredParams: [],
    queryParams: {},
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`baseMetrics.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postTenancyBaseMetric = () => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/basemetric/`,
    apiId: "api_tenant_admin_basemetric_create",
    requiredParams: [],
    queryParams: {},
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`baseMetrics.byId`, data);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `baseMetrics.editById.SHOW_FORM`,
      formObjPath: `baseMetrics.editById.editItem`,
    },
  };
};

export const putTenancyBaseMetric = ({ baseMetricId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tenant/admin/basemetric/${baseMetricId}/`,
    apiId: "api_tenant_admin_basemetric_update",
    requiredParams: ["baseMetricId"],
    queryParams: {},
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`baseMetrics.byId`, data);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `baseMetrics.editById.${baseMetricId}.SHOW_FORM`,
      formObjPath: `baseMetrics.editById.${baseMetricId}.editItem`,
    },
  };
};

export const patchTenancyBaseMetric = ({ baseMetricId }) => {
  let { fetchParams, stateParams } = putTenancyBaseMetric({ baseMetricId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_tenant_admin_basemetric_partial_update",
  });
  return { fetchParams, stateParams };
};
