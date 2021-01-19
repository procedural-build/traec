export const getMetricCalculations = ({}) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/indicator/`,
    apiId: "api_tenant_admin_indicator_list",
    requiredParams: [],
    queryParams: {},
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`metricCalculation.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postTenantIndicator = () => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/indicator/`,
    apiId: "api_tenant_admin_indicator_create",
    requiredParams: [],
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addListToDict(`metricCalculation.byId`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putTenantIndicator = ({ indicatorId }) => {
  let { fetchParams, stateParams } = postTenantIndicator();
  Object.assign(fetchParams, {
    method: "PUT",
    url: `/api/tenant/admin/indicator/${indicatorId}/`,
    apiId: "api_tenant_admin_indicator_update",
    requiredParams: ["indicatorId"],
  });

  return { fetchParams, stateParams };
};
