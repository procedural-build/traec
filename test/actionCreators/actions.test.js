import * as actions from "../../src/redux/actionCreators";

describe("Action Fetch to State", () => {
  it("Call fetchToState and expect an API call", () => {
    const body = "Finish docs";
    const state = "Current State";
    const fetchP = { fetch: "Fetch Parameters" };
    const params = { stateParams: state, fetchParams: fetchP };
    const expectedAction = {
      APICallTypes: { defaultType: "ENTITY_SET_FUNC" },
      fetchParams: { body, fetch: "Fetch Parameters" },
      stateParams: state
    };
    expect(actions.fetchToState(params, body)).toEqual(expectedAction);
  });
});

describe("Action Toggle Form", () => {
  it("Call Toggleform", () => {
    const state = true;
    const expectedAction = {
      type: "ENTITY_TOGGLE_BOOL",
      stateParams: state
    };
    expect(actions.toggleForm(state)).toEqual(expectedAction);
  });
});
