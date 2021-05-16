export const getCompanyMembers = ({ companyId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/member/`,
    apiId: "api_company_member_list",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`companyObjects.byId.${companyId}.members`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const deleteCompanyMember = ({ companyId, memberId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/company/${companyId}/member/${memberId}/`,
    apiId: "api_company_member_delete",
    requiredParams: ["companyId", "memberId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.removeInPath(`companyObjects.byId.${companyId}.members.${memberId}`);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};


export const updateCompanyMember = ({ companyId, memberId, pushBelow = false }) => {
  const fetchParams = {
    method: "PATCH",
    url: `/api/company/${companyId}/member/${memberId}/${pushBelow? "?push_below=True": ""}`,
    apiId: "api_company_member_patch",
    requiredParams: ["companyId", "memberId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`companyObjects.byId.${companyId}.members`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};