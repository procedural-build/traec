export const getVersion = () => {
  const fetchParams = {
    method: "GET",
    url: `/api/version/`,
    apiId: "api_version_read",
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;

    if (!data.errors) {
      return state.setInPath(`version`, data);
    }
    return state.setInPath(`errors.version`, data.errors.message);
  };

  return { fetchParams, stateParams: { stateSetFunc } };
};
