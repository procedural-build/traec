export const getProjectEmailRecipients= ({projectId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/email/recipient/`,
        apiId: 'api_project_email_recipient_list',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(`projectObjects.byId.${projectId}.recipients`, data)
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const getProjectEmailRecipient= ({projectId, recipientId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/email/recipient/${recipientId}`,
        apiId: 'api_project_email_recipient_list',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addToDict(`projectObjects.byId.${projectId}.recipients`, data)
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}
