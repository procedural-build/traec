


export const getGeneric = ({ url, successHandler }) => {
    const fetchParams = {
      method: "GET",
      url,
      apiId: "api_generic_read",
      requiredParams: ["url"]
    };
    const stateSetFunc = (state, action) => {
        return state.setInPath(`url.responses.${url}`, action.payload);
    };
    return { fetchParams, stateParams: { stateSetFunc } };
};
  