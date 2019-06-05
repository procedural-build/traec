import { edgeDictToState } from "./commitEdges";

export const storeCommitBranch = (state, item) => {
  if (!item) {
    return state;
  }
  let newState = state;
  // If there are edges included then store them away
  if (item.target_edges) {
    let commitId = item.target_commit.uid;
    newState = edgeDictToState(newState, commitId, item.target_edges);
  }
  // Add the ref into the store
  let targetRef = item.target.ref;
  item.target.ref = targetRef ? targetRef.uid : null;
  newState = targetRef ? newState.addToDict(`refs.byId`, targetRef) : newState;
  // Add the target commit into the store
  let targetCommit = item.target.commit;
  item.target.commit = targetCommit ? targetCommit.uid : null;
  newState = targetCommit ? newState.addToDict(`commits.byId`, targetCommit) : newState;
  // If this item belongs to a commit then store it
  let isRoot = item.commit ? false : true;
  let commitId = item.commit ? item.commit : targetCommit ? targetCommit.uid : null || targetRef.latest_commit.uid;
  let branchId = item.branchId;
  let rootPath = isRoot ? `root.branch.${branchId}.byId` : `commit.${commitId}.branch.${branchId}.byId`;
  newState = newState.addToDict(`commitBranches.${rootPath}`, [item]);
  return newState;
};

export const storeCommitBranches = (state, data) => {
  let newState = state;
  for (let item of data) {
    newState = storeCommitBranch(newState, item);
  }
  return newState;
};

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
