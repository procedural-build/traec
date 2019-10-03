export const getTenancyBaseMetrics = ({}) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/basemetric/`,
    apiId: "api_tenant_admin_basemetric_list",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`baseMetrics.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putTenancyBaseMetric = ({ baseMetricId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tenant/admin/basemetric/${baseMetricId}/`,
    apiId: "api_tenant_admin_basemetric_update",
    requiredParams: ["baseMetricId"],
    queryParams: {}
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
      formObjPath: `baseMetrics.editById.${baseMetricId}.editItem`
    }
  };
};

export const patchTenancyBaseMetric = ({ baseMetricId }) => {
  let { fetchParams, stateParams } = putTenancyBaseMetric({ baseMetricId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_tenant_admin_basemetric_partial_update"
  });
  return { fetchParams, stateParams };
};

/* SUB-TENANCIES */

export const getSubTenancies = ({}) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/tenant/`,
    apiId: "api_tenant_admin_tenant_list",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`tenants.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postSubTenant = ({}) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/tenant/`,
    apiId: "api_tenant_admin_tenant_create",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`tenants.byId`, data);
  };
  return {
    fetchParams,
    stateParams: { stateSetFunc, formVisPath: `tenants.SHOW_FORM`, formObjPath: `tenants.newItem` }
  };
};

export const deleteSubTenant = ({ tenantId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tenant/admin/tenant/${tenantId}/`,
    apiId: "api_tenant_admin_tenant_delete",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    return state.removeInPath(`tenants.byId.${tenantId}}`);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

/* ACTION DISPATCH */

export const postTenantDispatch = ({}) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/dispatch/`,
    apiId: "api_tenant_admin_dispatch_create",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state;
  };
  return {
    fetchParams,
    stateParams: { stateSetFunc }
  };
};
