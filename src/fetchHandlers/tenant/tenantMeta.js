export const getTenantMeta = () => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/meta/`,
    apiId: "api_tenant_meta_read",
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;

    if (!data.errors) {
      return state.setInPath(`tenant`, data);
    }
    return state.setInPath(`errors.tenant`, data.errors.message);
  };

  return { fetchParams, stateParams: { stateSetFunc } };
};
