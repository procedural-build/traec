export const getTenancyCategories = ({ companyId = null }) => {
  let query_params = companyId ? `?companyId=${companyId}` : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/category/${query_params}`,
    apiId: "api_tenant_admin_category_list",
    requiredParams: [],
    queryParams: {},
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`metricCategories.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};