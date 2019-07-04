export const getCompanyEmailRecipients = ({ companyId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/email/recipient/`,
    apiId: "api_company_email_recipient_list",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`companyObjects.byId.${companyId}.recipients`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getCompanyEmailRecipient = ({ companyId, recipientId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/email/recipient/${recipientId}/`,
    apiId: "api_company_email_recipient_read",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addToDict(`companyObjects.byId.${companyId}.recipients`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCompanyEmailRecipient = ({ companyId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/company/${companyId}/email/recipient/`,
    apiId: "api_company_email_recipient_create",
    requiredParams: ["companyId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`companyObjects.byId.${companyId}.recipients`, data);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `ui.companyObjects.byId.${companyId}.recipient.SHOW_FORM`,
      formObjPath: `ui.companyObjects.byId.${companyId}.recipient.newItem`
    }
  };
};

export const putCompanyEmailRecipient = ({ companyId, recipientId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/company/${companyId}/email/recipient/${recipientId}/`,
    apiId: "api_company_email_recipient_update",
    requiredParams: ["companyId", "recipientId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addToDict(`companyObjects.byId.${companyId}.recipients`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const patchCompanyEmailRecipient = ({ companyId, recipientId }) => {
  let params = putCompanyEmailRecipient({ companyId, recipientId });
  Object.assign(params.fetchParams, {
    method: "PATCH",
    apiId: "api_company_email_recipient_partial_update"
  });
  return params;
};
