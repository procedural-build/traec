const baseMetricsToState = (state, item) => {
  let baseMetrics = item.baseMetrics || [];
  return state.addListToDict(`baseMetrics.byId`, baseMetrics);
};

export const getCompanyIndicators = ({ companyId, allAvailable = false }) => {
  let query_params = allAvailable ? `?allAvailable=true` : "";
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/indicator/${query_params}`,
    apiId: "api_company_indicator_list",
    requiredParams: ["companyId"],
    queryParams: { allAvailable: false }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let pathEnd = allAvailable ? "availableIndicators" : "indicators";
    let path = `companyObjects.byId.${companyId}.${pathEnd}`;
    // Save the baseMetrics
    let newState = state;
    for (let item of data) {
      newState = baseMetricsToState(newState, item);
    }
    newState = newState.addListToDict(path, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCompanyIndicator = ({ companyId, fromExistingId = null }) => {
  let query_params = fromExistingId ? `?fromExisting=${fromExistingId}` : "";
  const fetchParams = {
    method: "POST",
    url: `/api/company/${companyId}/indicator/${query_params}`,
    apiId: "api_company_indicator_create",
    requiredParams: ["companyId"],
    queryParams: { fromExistingId: null }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = baseMetricsToState(state, data);
    return newState.addListToDict(`companyObjects.byId.${companyId}.indicators`, [data]);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const deleteCompanyIndicator = ({ companyId, indicatorId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/company/${companyId}/indicator/${indicatorId}/`,
    apiId: "api_company_indicator_delete",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    let path = `companyObjects.byId.${companyId}.indicators.${indicatorId}`;
    let newState = state.removeInPath(path);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
