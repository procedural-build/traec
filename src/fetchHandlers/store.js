export const putStoreImage = ({}) => {
  const fetchParams = {
    method: "POST",
    url: `/api/store/object/`,
    apiId: "api_store_object_create",
    requiredParams: [],
    queryParams: {},
    headers: { "content-type": null },
    rawBody: true
  };
  const stateSetFunc = (state, action) => {
    return state;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc
    }
  };
};
