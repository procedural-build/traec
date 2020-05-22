export const getProjectMembers = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/member/`,
    apiId: "api_project_member_list",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`projectObjects.byId.${projectId}.members`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const deleteProjectMember = ({ projectId, memberId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/project/${projectId}/member/${memberId}/`,
    apiId: "api_project_member_delete",
    requiredParams: ["projectId", "memberId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.removeInPath(`projectObjects.byId.${projectId}.members.${memberId}`);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postProjectMember = ({ projectId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/project/${projectId}/member/`,
    apiId: "api_project_member_create",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addToDict(`projectObjects.byId.${projectId}.members`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
