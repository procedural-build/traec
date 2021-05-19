import Im from "../../immutable";

export const postRegistration = ({}) => {
  const fetchParams = {
    url: "/auth-rest/register/",
    method: "POST",
    apiId: "api_auth_register_create",
    requiredParams: [],
  };

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    if (data.errors) {
      state.mergeIn(["registration"], Im.fromJS(data));
    }
    return state.mergeIn(["registration"], Im.fromJS({ redirect: "register_success_confirm" }));
  };

  return { fetchParams, stateParams: { stateSetFunc } };
};
