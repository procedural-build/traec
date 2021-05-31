export const postCompanyDispatch = ({ companyId }) => {
  let url = companyId ? `/api/company/${companyId}/dispatch/` : `/api/company/dispatch/`;
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
