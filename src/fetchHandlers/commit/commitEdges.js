import Im from "../../immutable";
import { edgeDictToState } from "../utils";

export const getCommitEdges = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/edge/${commitId}/`,
    apiId: "api_tracker_commit_edge_read",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    // Clear the existing commitEdges and set to null
    newState = newState.setInPath(`commitEdges.byId.${commitId}.trees`, Im.Map());
    // Unpack the data into the state tree
    newState = edgeDictToState(newState, commitId, data);
    return newState;
  };
  const stateCheckFunc = state => {
    return !(state.getInPath(`entities.commitEdges.byId.${commitId}.trees`) == null);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      stateCheckFunc
    }
  };
};

export const putCommitEdge = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/commit/edge/${commitId}/`,
    apiId: "api_tracker_commit_edge_update",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    // Unpack the data into the state tree
    newState = edgeDictToState(newState, commitId, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
