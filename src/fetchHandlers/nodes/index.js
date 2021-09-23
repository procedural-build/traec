import { getPtr, storeCommitNodes, updateCommitNodes } from "../utils";

export const getTrackerNodes = ({ trackerId, commitId, refId }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/`,
    apiId: "api_tracker_node_list",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    if (!data.errors) {
      return storeCommitNodes(state, commitId, data);
    }
    return state;
  };
  const stateCheckFunc = state => {
    return !(state.getInPath(`entities.commitNodes.${commitId}.byPath`) == null);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      stateCheckFunc
    }
  };
};

export const postTrackerNode = ({ trackerId, commitId, refId, path = null }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/`,
    apiId: "api_tracker_node_create",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = updateCommitNodes(state, commitId, Array.isArray(data) ? data : [data]);
    newState = newState.deleteIn(["commitNodes", path, "SHOW_FORM"]);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `commitNodes.${path}.SHOW_FORM`,
      formObjPath: `commitNodes.${path}.newItem`
    }
  };
};

export const putCommitNode = ({ trackerId, commitId, refId, pathId, update_status, allow_commit_change = false }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  let query_params =
    allow_commit_change || update_status
      ? `?allow_commit_change=${allow_commit_change}&update_status=${update_status}`
      : "";
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/${pathId}/${query_params}`,
    apiId: "api_tracker_node_update",
    requiredParams: ["trackerId", "commitId", "pathId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return updateCommitNodes(state, commitId, Array.isArray(data) ? data : [data]);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `commitNodes.${pathId}.SHOW_FORM`,
      formObjPath: `commitNodes.${pathId}.newItem`
    }
  };
};

export const patchCommitNode = ({ trackerId, commitId, refId, pathId, allow_commit_change = false }) => {
  let params = putCommitNode({ trackerId, commitId, refId, pathId, allow_commit_change });
  Object.assign(params.fetchParams, {
    method: "PATCH",
    apiId: "api_tracker_node_partial_update"
  });
  return params;
};

export const deleteCommitNode = ({ trackerId, commitId, refId, pathId }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/${pathId}/`,
    apiId: "api_tracker_node_delete",
    requiredParams: ["trackerId", "commitId", "pathId"],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    // Get the node and id
    //let nodeType = nodeNameMap[state.getInPath(`commitNodes.${commitId}.byPath.${pathId}.type`)]
    // Delete this node
    let newState = state.removeInPath(`commitNodes.${commitId}.byPath.${pathId}`);
    // Remove the reference to this node from the parent (not working)
    /*
    let parentPath = pathId.substring(0, pathId.length - 7)
    newState = state.removeInPath(`commitNodes.${commitId}.byPath.${parentPath}.children.byPath`, pathId);
    if (nodeType) {
      newState = state.removeInPath(`commitNodes.${commitId}.byPath.${parentPath}.children.byType.${nodeType}`, pathId);
    }
    */
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
