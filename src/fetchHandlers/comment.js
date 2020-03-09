export const getTreeComments = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/comment/`,
    apiId: "api_tracker_commit_tree_comment_list",
    requiredParams: ["trackerId", "commitId", "treeId", "refId"]
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    for (let item of data) {
      newState = newState.addToDict("comments.byId", item);
      newState = newState.setInPath(`commitEdges.byId.${commitId}.trees.${treeId}.comments.${item.uid}`, item.uid);
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

export const postTreeComment = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/comment/`,
    apiId: "api_tracker_commit_tree_comment_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    if (!data.errors) {
      newState = newState.addListToDict("comments.byId", data);
      newState = newState.setInPath(`commitEdges.byId.${commitId}.trees.${treeId}.comments.${data.uid}`, data.uid);
    }
    let { formObjPath, formVisPath } = action.stateParams;
    newState = newState.setInPath(formObjPath, data);
    newState = newState.setInPath(formVisPath, false);
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

export const deleteTreeComment = ({ trackerId, commitId, treeId, commentId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/comment/${commentId}/`,
    apiId: "api_tracker_commit_tree_comment_delete",
    requiredParams: ["trackerId", "commitId", "treeId", "commentId"]
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    if (!data.errors) {
      newState = newState.removeInPath(`comments.byId.${commentId}`);
      newState = newState.removeInPath(`commitEdges.byId.${commitId}.trees.${treeId}.comments.${commentId}`);
    }
    return newState;
  };

  return {
    fetchParams,
    stateParams: {
      stateSetFunc
    }
  };
};

export const putTreeComment = ({ trackerId, commitId, treeId, commentId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/comment/${commentId}/`,
    apiId: "api_tracker_commit_tree_comment_put",
    requiredParams: ["trackerId", "commitId", "treeId", "commentId"]
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    if (!data.errors) {
      newState = newState.setInPath(`comments.byId.${commentId}`, data);
    }
    let { formObjPath, formVisPath } = action.stateParams;
    newState = newState.setInPath(formObjPath, data);
    newState = newState.setInPath(formVisPath, false);
    return newState;
  };

  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `comments.editById.${commentId}.SHOW_NAME_FORM`,
      formObjPath: `comments.editById.${commentId}.newItem`
    }
  };
};
