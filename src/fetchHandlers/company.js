
export const getCompanies= () => {
    const fetchParams = {
        method: 'GET',
        url: `/api/company/`,
        apiId: 'api_company_list',
        requiredParams: []
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addListToDict(`companies.byId`, data)
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

export const getCompany= ({companyId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/company/${companyId}/`,
        apiId: 'api_company_read',
        requiredParams: ['companyId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state.addToDict(`companies.byId`, data)
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

export const postCompany= () => {
    const fetchParams = {
        method: 'POST',
        url: `/api/company/`,
        apiId: 'api_company_create',
        requiredParams: []
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            newState = newState.addToDict( 'companies.byId', data)
            newState = newState.setInPath( formVisPath, false)
        }
        // Add a to the parent list of childids
        let parentId = data.parentid
        if (parentId) {
            newState = newState.addListToSet(`companies.byId.${parentId}.childids`, [data.uid])
        }
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `companies.SHOW_FORM`,
        formObjPath: `companies.newItem`
    }}
}

export const putCompany= ({companyId}) => {
    let {fetchParams, stateParams} = postCompany()
    Object.assign(fetchParams, {
        method: 'PUT',
        url: `/api/company/${companyId}/`,
        apiId: 'api_company_update',
        requiredParams: ['companyId']
    })
    Object.assign(stateParams, {
        formVisPath: `companies.editById.${companyId}.SHOW_FORM`,
        formObjPath: `companies.editById.${companyId}.newItem`,
    })
    return {fetchParams, stateParams}
}


export const deleteCompany= ({companyId}) => {
    const fetchParams = {
        method: 'DELETE',
        url: `/api/company/${companyId}/`,
        apiId: 'api_company_delete',
        requiredParams: ['companyId'],
        // Deleting a Company can affect so many things that its
        // best to reload the page and all data again
        postSuccessHook: (data) => {location.reload()}
    }
    const stateSetFunc= (state, action) => {
        let newState = state
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}
