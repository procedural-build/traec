import Im from "../../immutable";
import { edgeDictToState } from "./commitEdge";
import { storeCommitNodes } from "./nodes";

export const reduceCommitBranch = item => {
  /*Returns a reduced version of the commitBranch without mutating the original object */
  // Get an immutable copy of the object
  let imItem = Im.fromJS(item);
  if (!item || !item.target) {
    return imItem;
  }
  // Replace the Ref with its id
  imItem = imItem.setInPath("target.ref", item.target.ref ? item.target.ref.uid : null);
  // Add the target commit into the store
  imItem = imItem.setInPath("target.commit", item.target.commit ? item.target.commit.uid : null);
  return imItem;
};

export const storeTarget = (state, target, _type = "ref") => {
  if (!target) {
    return state;
  }
  // Store the ref or commit
  let _target = target[_type];
  if (_target && _target.uid) {
    return state.addToDict(`${_type}s.byId`, _target, "uid", _target.uid.substring(0, 8));
  }
  return state;
};

export const storeCommitBranch = (state, item) => {
  if (!item) {
    return state;
  }
  let newState = state;

  // Do nothing if the branch is null or no target
  if (!item || !item.target) {
    return state;
  }

  // If there are edges included then store them away
  if (item.target_edges) {
    let commitId = item.target.commit ? item.target.commit.uid : item.target.ref.latest_commit.uid;
    newState = edgeDictToState(newState, commitId, item.target_edges);
  }

  // If there rae nodes included then store them away
  if (item.target_nodes) {
    let commitId = item.target.commit ? item.target.commit.uid : item.target.ref.latest_commit.uid;
    commitId = commitId || item.target.ref.latest_commit.uid;
    newState = storeCommitNodes(newState, commitId, item.target_nodes);
  }

  // Add the ref and commit into the store
  newState = storeTarget(newState, item.target, "ref");
  newState = storeTarget(newState, item.target, "commit");

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
