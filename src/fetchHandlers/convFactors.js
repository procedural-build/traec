const convFactorsToState = (newState, commitId, data) => {
  let baseMetrics = [];
  for (let item of data) {
    baseMetrics.push(item.metric);
    item.metric = item.metric.uid;
  }
  newState = newState.addListToDict(`commitEdges.byId.${commitId}.conversionFactors`, data);
  newState = newState.addListToDict(`baseMetrics.byId`, baseMetrics);
  return newState;
};

export const getConversionFactors = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/convfactor/`,
    apiId: "api_tracker_commit_convfactor_list",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return convFactorsToState(state, commitId, data);
  };
  const stateCheckFunc = state => {
    return !(state.getInPath(`entities.commitEdges.byId.${commitId}.conversionFactors`) == null);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      stateCheckFunc
    }
  };
};

export const postConversionFactor = ({ trackerId, commitId, from_commit_id = null }) => {
  let query_params = from_commit_id ? `?from_commit=${from_commit_id}` : "";
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/commit/${commitId}/convfactor/${query_params}`,
    apiId: "api_tracker_commit_convfactor_create",
    requiredParams: ["trackerId", "commitId"],
    queryParams: { from_commit_id: null }
  };
  const stateSetFunc = (state, action) => {
    if (from_commit_id) {
      let { stateParams } = getConversionFactors(trackerId, commitId);
      return stateParams.stateSetFunc(state, action);
    }
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = convFactorsToState(newState, commitId, [data]);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `commitEdges.editById.${commitId}.SHOW_CONVFACT_FORM`,
      formObjPath: `commitEdges.editById.${commitId}.newConversionFactor`
    }
  };
};

export const putConversionFactor = ({ trackerId, commitId, convFactorId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/commit/${commitId}/convfactor/${convFactorId}/`,
    apiId: "api_tracker_commit_convfactor_update",
    requiredParams: ["trackerId", "commitId", "convFactorId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = convFactorsToState(newState, commitId, [data]);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `commitEdges.editById.${commitId}.cfs.editById.${convFactorId}.SHOW_CONVFACT_FORM`,
      formObjPath: `commitEdges.editById.${commitId}.cfs.editById.${convFactorId}.newConversionFactor`
    }
  };
};

export const patchConversionFactor = ({ trackerId, commitId, convFactorId }) => {
  let { fetchParams, stateParams } = putConversionFactor({ trackerId, commitId, convFactorId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_tracker_commit_convfactor_partial_update"
  });
  return { fetchParams, stateParams };
};

export const deleteConversionFactor = ({ trackerId, commitId, convFactorId }) => {
  let { fetchParams, stateParams } = putConversionFactor({ trackerId, commitId, convFactorId });
  Object.assign(fetchParams, {
    method: "DELETE",
    apiId: "api_tracker_commit_convfactor_delete"
  });
  Object.assign(stateParams, {
    stateSetFunc: state => state.addListToDict(`commitEdges.byId.${commitId}.conversionFactors.${convFactorId}`)
  });
  return { fetchParams, stateParams };
};
