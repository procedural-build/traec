export const postDescription= ({trackerId, refId, commitId, treeId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/description/`,
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) { 
            newState = newState.addToDict( 'descriptions.byId', data)
            newState = newState.setInPath( formVisPath, false)
            newState = newState.addListToSets( 
                [`commitEdges.byId.${commitId}.trees.${treeId}.descriptions`], 
                [data.uid]
            )
        }
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}