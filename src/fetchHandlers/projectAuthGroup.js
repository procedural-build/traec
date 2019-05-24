import Im from '../immutable'


export const getProjectAuthGroups= ({projectId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/authgroup/`,
        apiId: 'api_project_authgroup_list',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(`projectObjects.byId.${projectId}.authgroups`, data)
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const postProjectAuthGroup= ({projectId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/project/${projectId}/authgroup/`,
        apiId: 'api_project_authgroup_create',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            newState = newState.addToDict( 
                `projectObjects.byId.${projectId}.authgroups`, data)
             newState = newState.setInPath( formVisPath, false)
        }
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const putProjectAuthGroup= ({projectId, authGroupId}) => {
    let {fetchParams, stateParams} = postProjectAuthGroup({projectId})
    fetchParams = {
        method: 'PUT',
        url: `/api/project/${projectId}/authgroup/${authGroupId}/`,
        apiId: 'api_project_authgroup_update',
        requiredParams: ['projectId', 'authGroupId']
    }
    // Reuse the same stateParams as from the post
    return {fetchParams, stateParams}
}

export const patchProjectAuthGroup= ({projectId, authGroupId}) => {
    let {fetchParams, stateParams} = putProjectAuthGroup({projectId, authGroupId})
    // Same as PUI, we are only changing the method
    Object.assign(fetchParams, { method: 'PATCH' })
    return {fetchParams, stateParams}
}


export const getProjectUserPermissions= ({projectId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/permission/`,
        apiId: 'api_project_permission_list',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.setInPath(`projectObjects.byId.${projectId}.userPermission`, data)
        newState = newState.setInPath(`projectObjects.byId.${projectId}.userPermission.actions`, Im.Set(data.actions))
        // Set project_discipline_ids and base_discipline_ids (helpers to avoid doing this repeatedly later)
        newState = newState.setInPath(`projectObjects.byId.${projectId}.userPermission.projectDisciplineIds`, 
            Im.Set(data.project_disciplines.map(i => i.uid)))
        newState = newState.setInPath(`projectObjects.byId.${projectId}.userPermission.baseDisciplineIds`, 
            Im.Set(data.project_disciplines.map(i => i.base_uid)))
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}
