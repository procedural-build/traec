export const postDescription = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/description/`
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict("descriptions.byId", data);
      newState = newState.setInPath(formVisPath, false);
      newState = newState.addListToSets([`commitEdges.byId.${commitId}.trees.${treeId}.descriptions`], [data.uid]);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putDescription = ({ trackerId, refId, treeId, commitId, descriptionId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/description/${descriptionId}/`,
    apiId: "api_tracker_ref_tree_description_update"
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict("descriptions.byId", data);
      newState = newState.setInPath(formVisPath, false);
      newState = newState.addListToSets([`commitEdges.byId.${commitId}.trees.${treeId}.descriptions`], [data.uid]);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `descriptions.editById.${descriptionId}.SHOW_EDIT_SCORE_FORM`,
      formObjPath: `descriptions.editById.${descriptionId}.editDescription`
    }
  };
};
