/*
COMMIT AND COMMIT HISTORY
*/

export const getCommits = ({ trackerId, refId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/ref/${refId}/commit/`,
    apiId: "api_tracker_ref_commit_list",
    requiredParams: ["trackerId", "refId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    const uids = data.map(item => item.uid);
    let newState = state.addListToDict("commits.byId", data, "uid", true);
    newState = newState.addListToSets([`categoryCommits.byId.${refId}`], uids);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCommit = ({ trackerId, refId, commitId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/commit/`,
    apiId: "api_tracker_ref_commit_create",
    requiredParams: ["trackerId", "refId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict("commits.byId", data);
      newState = newState.setInPath(`refs.byId.${refId}.latest_commit`, data);
      newState = newState.addListToSets([`categoryCommits.byId.${refId}`], [data.uid]);
      newState = newState.setInPath(formVisPath, false);
      // Remove the commitBranch information for this commit (so it is re-fetched)
      newState = newState.removeInPath(`commitBranches.commit.${commitId}`);
      // Remove the categoryCommit log (so it is re-fetched)
      newState = newState.removeInPath(`categoryCommits.byId.${refId}`);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `commits.editById.${commitId}.SHOW_COMMIT_FORM`,
      formObjPath: `commits.editById.${commitId}.newItem`
    }
  };
};

export const putCommit = ({ trackerId, refId, commitId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/ref/${refId}/commit/${commitId}/`,
    apiId: "api_tracker_ref_commit_update",
    requiredParams: ["trackerId", "refId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict("commits.byId", data);
      newState = newState.addListToSets([`categoryCommits.byId.${refId}`], [data.uid]);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `commits.editById.${commitId}.SHOW_COMMIT_FORM`,
      formObjPath: `commits.editById.${commitId}.newItem`
    }
  };
};

export const patchCommit = ({ trackerId, refId, commitId }) => {
  let { fetchParams, stateParams } = putCommit({ trackerId, refId, commitId });
  Object.assign(fetchParams, { method: "PATCH" });
  return { fetchParams, stateParams };
};

export const getAllCommits = () => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/commit/`,
    apiId: "api_tracker_commit_all_list",
    requiredParams: [],
    queryParams: { requiresAction: true }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addToDict("commits.byId", data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
