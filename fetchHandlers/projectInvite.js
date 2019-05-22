
export const getProjectInvites= ({projectId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/invite/`,
        apiId: 'api_project_invite_list',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(
            `projectObjects.byId.${projectId}.invites`, data
        )
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const postProjectInvite= ({projectId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/project/${projectId}/invite/`,
        apiId: 'api_project_invite_create',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            newState = newState.addToDict( 
                `projectObjects.byId.${projectId}.invites`, data)
             newState = newState.setInPath( formVisPath, false)
        }
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `ui.projectObjects.byId.${projectId}.invite.SHOW_FORM`,
        formObjPath: `ui.projectObjects.byId.${projectId}.invite.newItem`,
    }}
}


export const putProjectInvite= ({projectId, inviteId}) => {
    const fetchParams = {
        method: 'PUT',
        url: `/api/project/${projectId}/invite/${inviteId}/`,
        apiId: 'api_project_invite_update',
        requiredParams: ['projectId', 'inviteId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(`projectInvites.byId`, data)
        newState = newState.setInPath(`projectObjects.requiresReload`, true)
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `ui.projectObjects.byId.${projectId}.invites.byId.${inviteId}.SHOW_FORM`,
        formObjPath: `ui.projectObjects.byId.${projectId}.invites.byId.${inviteId}.newItem`,
    }}
}


export const deleteProjectInvite= ({projectId, inviteId}) => {
    const fetchParams = {
        method: 'DELETE',
        url: `/api/project/${projectId}/invite/${inviteId}/`,
        apiId: 'api_project_invite_delete',
        requiredParams: ['projectId', 'inviteId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state
        if (!data.errors) {
            newState = newState.deleteIn(`projectObjects.byId.${projectId}.invites.${inviteId}`.split('.'))
        } 
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const getAllProjectInvites= () => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/invite/`,
        apiId: 'api_project_invite_all_list',
        requiredParams: []
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(
            `projectInvites.byId`, data
        )
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

