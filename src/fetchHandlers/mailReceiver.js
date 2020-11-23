export const getMailReceiver = ({ userId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/mailinglist/?user=${userId}`,
    apiId: "api_mailReceiver_read",
    requiredParams: ["userId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    if (!data.errors) {
      return state.setInPath(`user.mailReceiver`, data);
    }
    return state.setInPath(`errors.user`, data.errors.message);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};


export const createMailReceiver = () => {
  const fetchParams = {
    method: "POST",
    url: `/api/mailinglist/`,
    apiId: "api_mailReceiver_create",
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    if (!data.errors) {
      return state.setInPath(`user.mailReceiver`, data);
    }
    return state.setInPath(`errors.user`, data.errors.message);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const deleteMailReceiver = ({ mailReceiverId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/mailinglist/${mailReceiverId}/`,
    apiId: "api_mailReceiver_delete"
  };
  const stateSetFunc = (state, action) => {
    return state.deleteIn(["user", "mailReceiver"]);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};