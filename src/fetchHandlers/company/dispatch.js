export const postCompanyDispatch = ({ companyId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/company/${companyId}/dispatch/`,
    apiId: "api_company_dispatch_create"
  };
  const stateSetFunc = (state, action) => {
    return state;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
