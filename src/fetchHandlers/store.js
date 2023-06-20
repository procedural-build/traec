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
    let payload = action.payload
    if (!payload.errors){
      let { hash } = payload
      return state
        .setInPath(`files.lastUpload`, payload)
        .setInPath(`files.byHash.${hash}`, payload)
    }
    return state.setInPath(`files.error`, payload.errors);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc
    }
  };
};
