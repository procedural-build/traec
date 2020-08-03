export const getTenancyConversionFactors = ({}) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tenant/admin/conversion/`,
    apiId: "api_tenant_admin_conversion_list",
    requiredParams: [],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    return state.addListToDict(`conversionFactors.byId`, data);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putTenancyConversionFactors = ({ conversionFactorId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tenant/admin/conversion/${conversionFactorId}/`,
    apiId: "api_tenant_admin_conversion_update",
    requiredParams: ["baseMetricId"],
    queryParams: {}
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

export const patchTenancyConversionFactors = ({ conversionFactorId }) => {
  let { fetchParams, stateParams } = putTenancyBaseMetric({ conversionFactorId });
  Object.assign(fetchParams, {
    method: "PATCH",
    apiId: "api_tenant_admin_conversion_partial_update"
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