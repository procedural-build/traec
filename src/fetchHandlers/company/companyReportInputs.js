export const getReportInputs = ({ companyId, startDate, endDate, cacheKey, indicatorId }) => {
  // Setup the query parameters
  let query_params = [];
  query_params.push(`from_date=${startDate}`);
  query_params.push(`to_date=${endDate}`);
  query_params.push(`indicatorId=${indicatorId}`);
  query_params = "?" + query_params.join("&");
  //
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/report/input/${query_params}`,
    apiId: "api_company_report_input_list",
    requiredParams: ["companyId", "startDate", "endDate", "cacheKey", "indicatorId"],
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(
      `companyReportingPeriods.byId.${companyId}.${cacheKey}.input_values.current`,
      data
    );
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
