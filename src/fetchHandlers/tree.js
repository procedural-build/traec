

export const postTree= ({trackerId, refId, commitId, treeId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/tree/`,
        apiId: 'api_tracker_ref_tree_tree_create',
        requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            // Extract a description if it is provided
            let descr = null
            if (data.description) {
                descr = data.description
                delete data.description
            }
            // Add the tree to state
            const commitPath = `commitEdges.byId.${commitId}.trees.${treeId}`
            newState = newState.addToDict( 'trees.byId', data)
            newState = newState.setInPath( formVisPath, false)
            newState = newState.addListToSets( [`${commitPath}.trees`], [data.uid])
            const treeCommitPath = `commitEdges.byId.${commitId}.trees.${data.uid}`
            newState = newState.setInPath(`${treeCommitPath}.parent`, treeId)

            if (descr) {
                // Add the description to state 
                newState = newState.addToDict( 'descriptions.byId', descr)
                newState = newState.addListToSets( [`${treeCommitPath}.descriptions`], [descr.uid])
            }
        }
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `trees.editById.${treeId}.SHOW_NAME_FORM`,
        formObjPath: `trees.editById.${treeId}.newItem`,
    }}
}




export const deleteTree= ({trackerId, refId, commitId, treeId}) => {
    const fetchParams = {
        method: 'DELETE',
        url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/`,
        apiId: 'api_tracker_ref_tree_delete',
        requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
    }
    const stateSetFunc= (state, action) => {
        let parentId = state.getInPath(`commitEdges.byId.${commitId}.trees.${treeId}.parent`)
        let newState = state.removeInPath(`commitEdges.byId.${commitId}.trees.${treeId}`)  
        if (parentId) {
            newState = newState.updateIn(`commitEdges.byId.${commitId}.trees.${parentId}.trees`.split('.'), i => i ? i.delete(treeId) : null)
        }
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}