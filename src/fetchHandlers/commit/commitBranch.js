import { storeCommitBranches } from "../utils";

export const getAllBranches = ({ trackerId, include_edges = false }) => {
  let queryParams = include_edges ? `?include_edges=True` : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/branch/${queryParams}`,
    apiId: "api_tracker_branch_list",
    requiredParams: ["trackerId"],
    queryParams: { include_edges: false }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return storeCommitBranches(state, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getCommitBranches = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/branch/`,
    apiId: "api_tracker_commit_branch_list",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return storeCommitBranches(state, data);
  };
  const stateCheckFunc = state => {
    return !(state.getInPath(`entities.commitBranches.commit.${commitId}`) == null);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      stateCheckFunc
    }
  };
};
