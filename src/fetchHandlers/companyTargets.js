export const getCompanyTargets = ({ companyId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/target/`,
    apiId: "api_company_target_list",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let path = `companyObjects.byId.${companyId}.targets`;
    let newState = state.addListToDict(path, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCompanyTarget = ({ companyId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/company/${companyId}/target/`,
    apiId: "api_company_target_create",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let path = `companyObjects.byId.${companyId}.targets`;
    let newState = state.addListToDict(path, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putCompanyTarget = ({ companyId, metricTargetId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/company/${companyId}/target/${metricTargetId}/`,
    apiId: "api_company_target_update",
    requiredParams: ["companyId", "metricTargetId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let path = `companyObjects.byId.${companyId}.targets`;
    let newState = state.addListToDict(path, [data]);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const patchCompanyTarget = ({ companyId, metricTargetId }) => {
  let params = putCompanyTarget({ companyId, metricTargetId });
  Object.assign(params.fetchParams, {
    method: "PATCH",
    apiId: "api_company_target_partial_update"
  });
  return params;
};
