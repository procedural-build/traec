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
