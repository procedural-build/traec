import fetch from "../../src/redux/reducers/uiReducer";
import Im from "../../src/immutable";

describe("UI Reducer", () => {
  const initialState = Im.fromJS({});

  it("should return the initial state", () => {
    expect(fetch(undefined, {})).toEqual(initialState);
  });

  it("should handle UI_SET_IN", () => {
    const payload = { toggle: false };
    const stateParams = { itemPath: "targets" };

    const expected = Im.fromJS({ targets: { toggle: false } });

    expect(
      fetch(initialState, {
        type: "UI_SET_IN",
        payload,
        stateParams
      })
    ).toEqual(expected);
  });

  it("should handle UI_MERGE_IN", () => {
    const payload = { mainTarget: 50, subTargets: 35 };
    const stateParams = { itemPath: "targets" };

    const initialState = Im.fromJS({ targets: { toggle: false } });
    const expected = Im.fromJS({ targets: { toggle: false, mainTarget: 50, subTargets: 35 } });

    expect(
      fetch(initialState, {
        type: "UI_MERGE_IN",
        payload,
        stateParams
      })
    ).toEqual(expected);
  });
});
