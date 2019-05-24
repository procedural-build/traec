export const getDisciplines= ({projectId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/project/${projectId}/discipline/`,
        apiId: 'api_project_discipline_list',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(`projectObjects.byId.${projectId}.disciplines`, data)
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const postDiscipline= ({projectId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/project/${projectId}/discipline/`,
        apiId: 'api_project_discipline_create',
        requiredParams: ['projectId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            newState = newState.addToDict( 
                `projectObjects.byId.${projectId}.disciplines`, data)
             newState = newState.setInPath( formVisPath, false)
        }
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `ui.projectObjects.byId.${projectId}.disciplines.SHOW_FORM`,
        formObjPath: `ui.projectObjects.byId.${projectId}.disciplines.newItem`,
    }}
}

export const putDiscipline= ({projectId, projectDisciplineId}) => {
    const fetchParams = {
        method: 'PUT',
        url: `/api/project/${projectId}/discipline/${projectDisciplineId}/`,
        apiId: 'api_project_discipline_update',
        requiredParams: ['projectId', 'projectDisciplineId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            newState = newState.addToDict( 
                `projectObjects.byId.${projectId}.disciplines`, data)
             newState = newState.setInPath( formVisPath, false)
        }
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `ui.projectObjects.byId.${projectId}.disciplines.editbyId.${projectDisciplineId}.SHOW_FORM`,
        formObjPath: `ui.projectObjects.byId.${projectId}.disciplines.editbyId.${projectDisciplineId}.newItem`,
    }}
}

export const deleteDiscipline= ({projectId, projectDisciplineId}) => {
    const fetchParams = {
        method: 'DELETE',
        url: `/api/project/${projectId}/discipline/${projectDisciplineId}/`,
        apiId: 'api_project_discipline_delete',
        requiredParams: ['projectId', 'projectDisciplineId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state
        if (!data.errors) {
            newState = newState.deleteIn(`projectObjects.byId.${projectId}.disciplines.${projectDisciplineId}`.split('.'))
        } 
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}