export const getProjectEmailRecipients = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/email/recipient/`,
    apiId: "api_project_email_recipient_list",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`projectObjects.byId.${projectId}.recipients`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};


export const getProjectEmailRecipient = ({ projectId, recipientId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/email/recipient/${recipientId}/`,
    apiId: "api_project_email_recipient_read",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addToDict(`projectObjects.byId.${projectId}.recipients`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};


export const putProjectEmailRecipient= ({projectId, recipientId}) => {
  const fetchParams = {
      method: 'PUT',
      url: `/api/project/${projectId}/email/recipient/${recipientId}/`,
      apiId: 'api_project_email_recipient_update',
      requiredParams: ['projectId', 'recipientId']
  }
  const stateSetFunc= (state, action) => {
      const data = action.payload
      let newState = state.addToDict(`projectObjects.byId.${projectId}.recipients`, data)
      return newState            
  }
  return {fetchParams, stateParams: {stateSetFunc}}
}


export const patchProjectEmailRecipient= ({projectId, recipientId}) => {
  let params = putProjectEmailRecipient({projectId, recipientId})
  Object.assign(params.fetchParams, {
      method: 'PATCH',
      apiId: 'api_project_email_recipient_partial_update',
  })
  return params
}