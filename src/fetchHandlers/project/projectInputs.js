export const getProjectInputs = ({ projectId, format = "excel" }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/inputs/`,
    apiId: "api_project_inputs_list",
    requiredParams: ["projectId"],
    queryParms: {}
  };
  let stateSetFunc = (state, action) => {
    return state;
  };
  // Adjust the headers based on if the format is excel
  if (format == "excel") {
    Object.assign(fetchParams, { headers: { "content-type": "application/xlsx" } });
    stateSetFunc = (state, action) => {
      return state;
    };
  }
  //
  return { fetchParams, stateParams: { stateSetFunc } };
};
