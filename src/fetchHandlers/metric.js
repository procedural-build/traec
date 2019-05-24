import Crypto from 'crypto'
import {postTree} from './tree'


/*
When we make a metric we will also create a folder for the metric 
(and any evidence/documents that might be required later).  
We will do this using Redux Thunk middleware to pass functions in
an action -> which can then dispatch more actions in itself.  This 
allows us to create Async Action Creators as discussed in the official
Redux documentation here:
https://redux.js.org/advanced/asyncactions#reducers-js
*/

export const postTreeScore = ({trackerId, refId, commitId, treeId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/score/`,
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) {
            // Add this item to the trackerImpact
            let baseMetric = data.metric
            data.metric = baseMetric.uid
            newState = newState.addToDict( 'metricScores.byId', data)
            newState = newState.addToDict( 'baseMetrics.byId', baseMetric)
            // Add it to the edges of its parent tree also
            newState = newState.addListToSet(`commitEdges.byId.${commitId}.trees.${treeId}.metricScores`, [data.uid])
        }
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

export const postTreeAndMetric = ({trackerId, refId, commitId, treeId}) => {
    /* Handler to create a tree and then immediately create a metric if the tree returns success
    We are modifying the body before calling fetch and giving a random string to the
    tree (we will not use the tree name itself - but the metric name)
    Attach a handler to the fetchParams, so that if successful in creating a tree
    then we will immediately dispatch to create a metric on that tree.
    */
    // Create the tree fetch handler
    let {fetchParams, stateParams} = postTree({trackerId, refId, commitId, treeId});
    Object.assign(fetchParams, {apiId: 'api_tracker_ref_tree_tree_and_metric_create'})
    // Modify the post to give a random name for the tree
    Object.assign(fetchParams, { 
        preFetchHook: (body) => { 
            return ({
                name: Crypto.createHash('sha1').update(body.name).digest('hex')
            })
        },
        // Attach a nextHandler to the tree - so that the metricscore is created on successful creation of the tree
        nextHandlers: [
            (data, post, orgpost) => {
                let {fetchParams, stateParams} = postTreeScore({trackerId, refId, commitId, treeId: data.uid})
                Object.assign(fetchParams, { body: {
                    metric: {...orgpost}
                }})
                return {fetchParams, stateParams}
            },
        ]
    })
    return {fetchParams, stateParams}
}

export const postTrackerMetric = ({trackerId, refId, commitId, treeId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/impact/`,
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) {
            newState = newState.addToDict( 'trackerImpact.byId', data)
        }
        return newState            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

export const getMetricInputs = ({trackerId, commitId}) => {
    const fetchParams = {
        method: 'GET',
        url: `/api/tracker/${trackerId}/commit/${commitId}/value/`,
        apiId: 'api_tracker_commit_value_list',
        requiredParams: ['trackerId', 'commitId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        // Clear the existing values
        let newState = state.setInPath( `commitEdges.byId.${commitId}.scoreValues`, {})
        // Load in the new values
        for (let item of data) {
            let metricScore = item.metric
            let metricScoreId = metricScore.uid
            let baseMetric = metricScore.metric 
            metricScore.metric = baseMetric.uid 
            item.metric = metricScore.uid
            newState = newState.addListToDict( `baseMetrics.byId`, [baseMetric])
            newState = newState.addListToDict( `metricScores.byId`, [item])
            newState = newState.addListToDict( `commitEdges.byId.${commitId}.scoreValues.${metricScoreId}.values`, [item])
        }
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

/* Post a single value for a metric */
export const postMetricScoreValue = ({trackerId, commitId, scoreId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/commit/${commitId}/score/${scoreId}/value/`,
        apiId: 'api_tracker_commit_score_value_create',
        requiredParams: ['trackerId', 'commitId', 'scoreId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) {
            newState = newState.addToDict( `commitEdges.byId.${commitId}.scoreValues.${scoreId}.values`, data)
            newState = newState.setInPath( formVisPath, false)
        }
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

/* Put/update single value for a metric */
export const putMetricScoreValue = ({trackerId, commitId, scoreId, inputValueId}) => {
    const fetchParams = {
        method: 'PUT',
        url: `/api/tracker/${trackerId}/commit/${commitId}/score/${scoreId}/value/${inputValueId}/`,
        apiId: 'api_tracker_commit_score_value_update',
        requiredParams: ['trackerId', 'commitId', 'scoreId', 'inputValueId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) {
            newState = newState.addToDict( `commitEdges.byId.${commitId}.scoreValues.${scoreId}.values`, data)
            newState = newState.setInPath( formVisPath, false)
        }
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}

/* Post multiple values for a metric */
export const postCommitScoreValues = ({trackerId, commitId}) => {
    const fetchParams = {
        method: 'POST',
        url: `/api/tracker/${trackerId}/commit/${commitId}/value/`,
        apiId: 'api_tracker_commit_value_create',
        requiredParams: ['trackerId', 'commitId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) {
            newState = newState.addListToDict( `commitEdges.byId.${commitId}.scoreValues.${scoreId}.values`, data)
            newState = newState.setInPath( formVisPath, false)
        }
        return newState
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}


export const patchTreeScore = ({trackerId, refId, commitId, treeId, metricScoreId}) => {
    const fetchParams = {
        method: 'PATCH',
        url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/score/${metricScoreId}/`,
        apiId: 'api_tracker_ref_tree_score_partial_update',
        requiredParams: ['trackerId', 'refId', 'commitId', 'treeId', 'metricScoreId']
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        let { formVisPath, formObjPath } = action.stateParams
        let newState = state.setInPath( formObjPath, data)
        if (!data.errors) {
            // Add this item to the trackerImpact
            let baseMetric = data.metric
            data.metric = baseMetric.uid
            newState = newState.addToDict( 'metricScores.byId', data)
            newState = newState.addToDict( 'baseMetrics.byId', baseMetric)
            // Add it to the edges of its parent tree also
            newState = newState.addListToSet(`commitEdges.byId.${commitId}.trees.${treeId}.metricScores`, [data.uid])
        }
        return newState            
    }
    return {fetchParams, stateParams: {
        stateSetFunc,
        formVisPath: `trees.editById.${treeId}.SHOW_EDIT_SCORE_FORM`,
        formObjPath: `trees.editById.${treeId}.editMetric`,
    }}
}
