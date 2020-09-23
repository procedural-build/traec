const getPath = groupId => {
  return groupId ? `conversionFactorGroups.byId.${groupId}.conversionFactors.byId` : `conversionFactors.byId`;
};

export const getTenancyConversionFactors = ({ groupId }) => {
  let query_params = groupId ? `?groupId=${groupId}` : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/conversion/${query_params}`,
    apiId: "api_tenant_admin_conversion_list",
    requiredParams: [],
    queryParams: { groupId: "" }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(getPath(groupId), data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postTenancyConversionFactor = () => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/conversion/`,
    apiId: "api_tenant_admin_conversion_create",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let groupId = data.group;
    let newState = state;
    newState = newState.addListToDict(getPath(groupId), data);
    newState = newState.addListToDict(getPath(), data);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `conversionFactors.editById.SHOW_FORM`,
      formObjPath: `conversionFactors.editById.editItem`
    }
  };
};

export const putTenancyConversionFactor = ({ conversionFactorId, groupId = null }) => {
  let query_params = groupId ? `?groupId=${groupId}` : "";
  const fetchParams = {
    method: "PUT",
    url: `/api/tenant/admin/conversion/${conversionFactorId}/${query_params}`,
    apiId: "api_tenant_admin_conversion_update",
    requiredParams: ["conversionFactorId"],
    queryParams: { groupId }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`conversionFactors.byId`, data);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `conversionFactors.editById.${conversionFactorId}.SHOW_FORM`,
      formObjPath: `conversionFactors.editById.${conversionFactorId}.editItem`
    }
  };
};

export const patchTenancyConversionFactor = ({ conversionFactorId, groupId = null }) => {
  let { fetchParams, stateParams } = putTenancyConversionFactor({ conversionFactorId, groupId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_tenant_admin_conversion_partial_update"
  });
  return { fetchParams, stateParams };
};

export const deleteTenancyConversionFactor = ({ conversionFactorId, groupId = null }) => {
  let { fetchParams, stateParams } = putTenancyConversionFactor({ conversionFactorId, groupId });
  Object.assign(fetchParams, {
    method: "DELETE",
    apiId: "api_tenant_admin_conversion_delete"
  });
  return { fetchParams, stateParams };
};

export const getTenancyConversionFactorGroups = ({}) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/conversion_group/`,
    apiId: "api_tenant_admin_conversion_group_list",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`conversionFactorGroups.byId`, data, "id");
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postTenancyConversionFactorGroup = () => {
  const fetchParams = {
    method: "POST",
    url: `/api/tenant/admin/conversion_group/`,
    apiId: "api_tenant_admin_conversion_group_create",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addToDict(`conversionFactorGroups.byId`, data, "id");
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `conversionFactorsGroups.editById.SHOW_FORM`,
      formObjPath: `conversionFactorsGroups.editById.editItem`
    }
  };
};
