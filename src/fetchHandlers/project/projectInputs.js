export const getProjectInputs = ({ projectId, refId = null, output_format = "excel" }) => {
  let query_string = new URLSearchParams({
    ...(refId ? { refId } : {}),
    output_format
  }).toString();

  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/inputs/?${query_string}`,
    apiId: "api_project_inputs_list",
    requiredParams: ["projectId"],
    queryParms: { refId: null, output_format: "excel" }
  };
  let stateSetFunc = (state, action) => {
    return state;
  };
  // Adjust the headers based on if the format is excel
  if (output_format == "excel") {
    Object.assign(fetchParams, { headers: { "content-type": "application/xlsx" } });
    stateSetFunc = (state, action) => {
      return state;
    };
  }
  //
  return { fetchParams, stateParams: { stateSetFunc } };
};
