export const postCompanyDispatch = ({ companyId, query_params = {} }) => {
  // Its possible to provide query parameters to the URL to by pass fetch throttling.
  // POST requests can be hashed and included as a query parameter
  let _query_string = new URLSearchParams(query_params).toString();
  _query_string = _query_string ? `?${_query_string}` : "";

  let url = companyId ? `/api/company/${companyId}/dispatch/${_query_string}` : `/api/company/dispatch/`;
  const fetchParams = {
    method: "POST",
    url,
    apiId: "api_company_dispatch_create"
  };
  const stateSetFunc = (state, action) => {
    return state;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
