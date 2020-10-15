export const getProjectStatuses = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/status/`,
    apiId: "api_project_status_list",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(`projectObjects.byId.${projectId}.statuses`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
