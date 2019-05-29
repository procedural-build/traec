import fetch from "../../src/redux/reducers/fetchReducers";
import Im from "../../src/immutable";
import MockDate from "mockdate";

describe("Fetch Reducer", () => {
  const initialState = Im.fromJS({});
  it("should return the initial state", () => {
    expect(fetch(undefined, {})).toEqual(initialState);
  });

  it("should handle FETCH_SET_SENT", () => {
    MockDate.set("1/1/2020");
    const fetchParams = { body: { username: "user", password: "test" }, method: "POST", url: "/auth-jwt/get/" };
    const expected = Im.fromJS({
      "POST /auth-jwt/get/": {
        timeSent: new Date(),
        timeRecv: null,
        status: "sent",
        refreshRequired: false,
        retries: 0,
        failures: 0
      }
    });
    expect(
      fetch(initialState, {
        type: "FETCH_SET_SENT",
        fetchParams
      })
    ).toEqual(expected);
    MockDate.reset();
  });
});
