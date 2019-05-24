export const putHead= ({trackerId, refId, branchId}) => {
    const fetchParams = {
        method: 'PUT',
        url: `/api/tracker/${trackerId}/ref/${refId}/head/${branchId}/`,
        apiId: 'api_tracker_ref_head_update'
    }
    const stateSetFunc= (state, action) => {
        const data = action.payload
        return state            
    }
    return {fetchParams, stateParams: {stateSetFunc}}
}
