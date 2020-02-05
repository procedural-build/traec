export const getTreeComments = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/comment/`,
    apiId: "api_tracker_commit_tree_comment_list",
    requiredParams: ["trackerId", "commitId", "treeId", "refId"]
  };
  console.log(trackerId, commitId, treeId);
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    console.log("Fetching comments", data);
    let newState = state.addListToDict("comments.byId", data);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `comments.editById.${treeId}.SHOW_NAME_FORM`,
      formObjPath: `comments.editById.${treeId}.newItem`
    }
  };
};

export const postTreeComment = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/comment/`,
    apiId: "api_tracker_commit_tree_comment_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      console.log("TODO");
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `comments.editById.${treeId}.SHOW_NAME_FORM`,
      formObjPath: `comments.editById.${treeId}.newItem`
    }
  };
};
