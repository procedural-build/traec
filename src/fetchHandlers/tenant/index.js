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
