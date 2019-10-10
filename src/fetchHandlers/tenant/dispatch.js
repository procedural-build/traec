export const postTenantDispatch = ({}) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/dispatch/`,
    apiId: "api_tenant_admin_dispatch_create",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state;
  };
  return {
    fetchParams,
    stateParams: { stateSetFunc }
  };
};
