import { storeCommitBranch } from "./commitBranch";

export const getAllRefs = ({ isResponsible = true }) => {
  let query_params = isResponsible ? `?isResponsible=true` : "?isResponsible=false";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/ref/${query_params}`,
    apiId: "api_tracker_ref_all_list",
    requiredParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`refs.byId`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getTrackerRefs = ({ trackerId, refId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/ref/`,
    apiId: "api_tracker_ref_list",
    requiredParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`refs.byId`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getRef = ({ trackerId, refId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/ref/${refId}/`,
    apiId: "api_tracker_ref_read",
    requiredParams: ["trackerId", "refId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addToDict(`refs.byId`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCategoryRef = ({ trackerId, refId, commitId, treeId, skip_categories = false }) => {
  let query_params = skip_categories ? `?skip_categories=true` : "";
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/branch/${query_params}`,
    apiId: "api_tracker_ref_tree_branch_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = storeCommitBranch(newState, data);
      newState = newState.addToDict(`commitEdges.byId.${commitId}.trees.${treeId}.categories`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `trees.editById.${treeId}.SHOW_NAME_FORM`,
      formObjPath: `trees.editById.${treeId}.newItem`
    }
  };
};

export const patchCategoryRef = ({ trackerId, refId }) => {
  const fetchParams = {
    method: "PATCH",
    url: `/api/tracker/${trackerId}/ref/${refId}/`,
    apiId: "api_tracker_ref_partial_update",
    requiredParams: ["trackerId", "refId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.setInPath(`refs.byId.${refId}`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `refs.byId.${refId}.SHOW_FORM`,
      formObjPath: `refs.editById.${refId}.editObj`
    }
  };
};

export const postRootRef = ({ trackerId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/`,
    apiId: "api_tracker_ref_create",
    requiredParams: ["trackerId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      // Response should be a ref which is added to the refs.byId and also tracker.alt_root_masters
      newState = newState.addToDict("refs.byId", data);
      newState = newState.setInPath(
        `trackers.byId.${trackerId}.alt_root_masters.${data.latest_commit.root_commit}`,
        data.uid
      );
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getRefBranches = ({ trackerId, refId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/ref/${refId}/submodule/`,
    apiId: "api_tracker_ref_submodule_list",
    requiredParams: ["trackerId", "refId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    const uids = data.map(item => item.uid);
    let newState = state;
    let commitId = null;
    let branchId = null;
    let isRoot = null;
    for (let item of data) {
      // Add the ref into the store
      let targetRef = item.target.ref;
      item.target.ref = targetRef ? targetRef.uid : null;
      newState = targetRef ? newState.addToDict(`refs.byId`, targetRef) : newState;
      // Add the target commit into the store
      let targetCommit = item.target.commit;
      item.target.commit = targetCommit ? targetCommit.uid : null;
      newState = targetCommit ? newState.addToDict(`commits.byId`, targetCommit) : newState;
      // If this item belongs to a commit then store it
      isRoot = item.commit ? false : true;
      commitId = item.commit ? item.commit : targetCommit ? targetCommit.uid : null || targetRef.latest_commit.uid;
      branchId = item.branchId;
      let rootPath = isRoot ? `root.${commitId}.branch.${branchId}.byId` : `commit.${commitId}.branch.${branchId}.byId`;
      newState = newState.addToDict(`commitBranches.${rootPath}`, [item]);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postBranch = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/`,
    apiId: "api_tracker_ref_tree_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      const commitPath = `commitEdges.byId.${commitId}.trees.${treeId}`;
      newState = newState.addToDict("refs.byId", data);
      newState = newState.setInPath(formVisPath, false);
      // Add the root commit to the category list for this tree
      const branchId = data.latest_commit.root_commit;
      newState = newState.addListToSets([`${commitPath}.categories`], [branchId]);
      // Add this as a commitBranch (masterHead) for the parentCommit
      let target = { commit: null, ref: data.uid };
      let head = { commit: commitId, target, branchId, is_master: true };
      let branchObj = {
        targets: [target],
        masterHead: head,
        userHead: head
      };
      newState = newState.setInPath(`commitBranches.commit.${commitId}.branch.${branchId}`, branchObj);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const deleteTrackerRef = ({ trackerId, refId, commitId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/ref/${refId}/`,
    apiId: "api_tracker_ref_delete",
    requiredParams: ["trackerId", "refId", "commitId"],
    // Deleting a Ref can affect so many things that its
    // best to reload the page and all data again
    postSuccessHook: data => {
      location.reload();
    }
  };
  const stateSetFunc = (state, action) => {
    let newState = state;
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postBranchFork = ({ trackerId, refId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/`,
    apiId: "api_tracker_ref_tree_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      const commitPath = `commitEdges.byId.${commitId}.trees.${treeId}`;
      newState = newState.addToDict("refs.byId", data);
      newState = newState.setInPath(formVisPath, false);
      // Add the root commit to the category list for this tree
      const branchId = data.latest_commit.root_commit;
      newState = newState.addListToSets([`${commitPath}.categories`], [branchId]);
      // Add this as a commitBranch (masterHead) for the parentCommit
      let target = { commit: null, ref: data.uid };
      let head = { commit: commitId, target, branchId, is_master: true };
      let branchObj = {
        targets: [target],
        masterHead: head,
        userHead: head
      };
      newState = newState.setInPath(`commitBranches.commit.${commitId}.branch.${branchId}`, branchObj);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
