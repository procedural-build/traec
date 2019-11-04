import Im from "../../immutable";
import { edgeDictToState } from "./commitEdge";

export const reduceCommitBranch = item => {
  /*Returns a reduced version of the commitBranch without mutating the original object */
  // Get an immutable copy of the object
  let imItem = Im.fromJS(item);
  // Replace the Ref with its id
  imItem = imItem.setInPath("target.ref", item.target.ref ? item.target.ref.uid : null);
  // Add the target commit into the store
  imItem = imItem.setInPath("target.commit", item.target.commit ? item.target.commit.uid : null);
  return imItem;
};

export const storeCommitBranch = (state, item) => {
  if (!item) {
    return state;
  }
  let newState = state;
  // If there are edges included then store them away
  if (item.target_edges) {
    let commitId = item.target.commit ? item.target.commit.uid : item.target.ref.latest_commit.uid;
    newState = edgeDictToState(newState, commitId, item.target_edges);
  }
  // Add the ref and commit into the store
  newState = item.target.ref ? newState.addToDict(`refs.byId`, item.target.ref) : newState;
  newState = item.target.commit ? newState.addToDict(`commits.byId`, item.target.commit) : newState;
  // Add the new item to the state
  newState = newState.setInPath(`${getCommitBranchRootPath(item)}.${item.uid}`, reduceCommitBranch(item));
  //newState = newState.addToDict(`commitBranches.${rootPath}`, [item]);
  return newState;
};

export const storeCommitBranches = (state, data) => {
  let newState = state;
  for (let item of data) {
    newState = storeCommitBranch(newState, item);
  }
  return newState;
};

export const getCommitBranchRootPath = item => {
  // If this item belongs to a commit then store it
  let isRoot = item.commit ? false : true;
  let commitId = item.commit
    ? item.commit
    : item.target.commit
    ? item.target.commit.uid
    : null || item.target.ref.latest_commit.uid;
  let branchId = item.branchId;
  let rootPath = isRoot ? `root.branch.${branchId}.byId` : `commit.${commitId}.branch.${branchId}.byId`;
  return `commitBranches.${rootPath}`;
};
