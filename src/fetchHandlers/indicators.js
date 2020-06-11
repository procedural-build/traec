export const getCommitIndicators = ({ trackerId, commitId, allAvailable = false }) => {
  let queryStr = allAvailable ? "?allAvailable=true" : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/indicator/${queryStr}`,
    apiId: "api_tracker_commit_indicator_list",
    requiredParams: ["trackerId", "commitId"],
    queryParams: { allAvailable: false }
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let path = `commitEdges.byId.${commitId}.indicators`;
    if (allAvailable) {
      path = "indicators.byId";
    }
    let newState = state.addListToDict(path, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postCommitIndicator = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/commit/${commitId}/indicator/`,
    apiId: "api_tracker_commit_indicator_create",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addListToDict(`commitEdges.byId.${commitId}.indicators`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putCommitIndicator = ({ trackerId, commitId, indicatorId }) => {
  let { fetchParams, stateParams } = postCommitIndicator({ trackerId, commitId });
  Object.assign(fetchParams, {
    method: "PUT",
    url: `/api/tracker/${trackerId}/commit/${commitId}/indicator/${indicatorId}/`,
    apiId: "api_tracker_commit_indicator_update",
    requiredParams: ["trackerId", "commitId", "indicatorId"]
  });

  return { fetchParams, stateParams };
};

export const patchCommitIndicator = ({ trackerId, commitId, indicatorId }) => {
  let { fetchParams, stateParams } = putCommitIndicator({ trackerId, commitId, indicatorId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_tracker_commit_indicator_partial_update"
  });
  return { fetchParams, stateParams };
};

export const deleteCommitIndicator = ({ trackerId, commitId, indicatorId, all_ref = true }) => {
  let query_params = all_ref ? "?all_ref=true" : "";
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/commit/${commitId}/indicator/${indicatorId}/${query_params}`,
    apiId: "api_tracker_commit_indicator_delete",
    requiredParams: ["trackerId", "commitId", "indicatorId"],
    queryParams: { all_ref: true }
  };
  const stateSetFunc = (state, action) => {
    return state.removeInPath(`commitEdges.byId.${commitId}.indicators.${indicatorId}`);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
