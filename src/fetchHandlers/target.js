
/*
METRIC TARGETS
*/

const metricTargetToState= (newState, item, commitId) => {
    let baseMetric = item.metric
    //let baseMetricId = baseMetric.uid
    //item.metric = baseMetricId
    newState = newState.addListToDict(`baseMetrics.byId`, [baseMetric])
    newState = newState.addListToDict(`commitEdges.byId.${commitId}.metricTargets`, [item])
    return newState
}

export const getCommitMetricTargets= ({trackerId, commitId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/tracker/${trackerId}/commit/${commitId}/target/`,
        apiId: 'api_tracker_commit_target_list',
        requiredParams: ['trackerId', 'commitId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state
        // Load in the new values
        for (let item of data) {
            newState = metricTargetToState(newState, item, commitId)
        }
        return newState
    }
    const stateCheckFunc= (state) => {
        return !(state.getInPath(`entities.commitEdges.byId.${commitId}.metricTargets`) == null)
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        stateCheckFunc
    }}
}

export const postCommitMetricTarget= ({trackerId, commitId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/commit/${commitId}/target/`,
        apiId: 'api_tracker_commit_target_create',
        requiredParams: ['trackerId', 'commitId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state
        // Load in the new values
        newState = metricTargetToState(newState, data, commitId)
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

export const putCommitMetricTarget= ({trackerId, commitId, metricTargetId}) => {
    const fetchParams = {
        method: 'PUT',
        url: `/api/tracker/${trackerId}/commit/${commitId}/target/${metricTargetId}/`,
        apiId: 'api_tracker_commit_target_update',
        requiredParams: ['trackerId', 'commitId', 'metricTargetId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let newState = state
        // Remove the old value if the node is replaced
        if (data.uid != metricTargetId) {
            newState = newState.removeInPath(`commitEdges.byId.${commitId}.metricTargets.${metricTargetId}`)
        }
        // Load in the new values
        newState = metricTargetToState(newState, data, commitId)
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

export const patchCommitMetricTarget = ({trackerId, commitId, metricTargetId}) => {
    let params = putCommitMetricTarget({trackerId, commitId, metricTargetId})
    Object.assign(params.fetchParams, {
        method: 'PATCH',
        apiId:  'api_tracker_commit_target_partial_update'
    })
    return params
}


export const deleteCommitMetricTarget = ({trackerId, commitId, metricTargetId}) => {
    const fetchParams = {
        method: 'DELETE',
        url: `/api/tracker/${trackerId}/commit/${commitId}/target/${metricTargetId}/`,
        apiId: 'api_tracker_commit_target_delete',
        requiredParams: ['trackerId', 'commitId', 'metricTargetId']
    }
    const stateSetFunc= (state, action) => {
        return state.removeInPath(`commitEdges.byId.${commitId}.metricTargets.${metricTargetId}`)
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}