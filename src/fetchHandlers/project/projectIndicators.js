const baseMetricsToState = (state, item) => {
  let baseMetrics = item.baseMetrics || [];
  return state.addListToDict(`baseMetrics.byId`, baseMetrics);
};

export const getProjectIndicators = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/indicator/`,
    apiId: "api_project_indicator_list",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let path = `projectObjects.byId.${projectId}.indicators`;
    // Save the baseMetrics
    let newState = state;
    for (let item of data) {
      newState = baseMetricsToState(newState, item);
    }
    newState = newState.addListToDict(path, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
