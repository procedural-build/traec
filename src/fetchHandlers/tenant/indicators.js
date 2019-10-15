export const getMetricCalculations = ({}) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/indicator/`,
    apiId: "api_tenant_admin_indicator_list",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`metricCalculation.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};