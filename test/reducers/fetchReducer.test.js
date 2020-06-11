import fetch from "../../src/redux/reducers/fetchReducers";
import Im from "../../src/immutable";
import MockDate from "mockdate";

describe("Fetch Reducer", () => {
  const initialState = Im.fromJS({});
  MockDate.set("1/1/2020");

  afterAll(() => {
    MockDate.reset();
  });

  it("should return the initial state", () => {
    expect(fetch(undefined, {})).toEqual(initialState);
  });

  it("should handle FETCH_SET_SENT", () => {
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
  });

  it("should handle FETCH_SUCCESS", () => {
    const fetchParams = {
      url: "/auth-jwt/verify/",
      method: "POST",
      body: {
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
      }
    };
    const expected = Im.fromJS({
      "POST /auth-jwt/verify/": { status: "success", timeRecv: new Date(), failures: 0, retries: 0 }
    });
    expect(
      fetch(initialState, {
        type: "FETCH_SUCCESS",
        fetchParams
      })
    ).toEqual(expected);
  });

  it("should handle FETCH_FAIL", () => {
    const initialState = Im.fromJS({ "POST /auth-jwt/verify/": {} });
    const fetchParams = {
      url: "/auth-jwt/verify/",
      method: "POST",
      body: {
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
      }
    };
    const statusText = "This is an Error!!!";
    const expected = Im.fromJS({
      "POST /auth-jwt/verify/": {
        status: "failed",
        timeRecv: new Date(),
        failures: 1,
        errors: statusText,
        error: Im.fromJS({ statusText })
      }
    });
    expect(
      fetch(initialState, {
        type: "FETCH_FAIL",
        fetchParams,
        error: { statusText }
      })
    ).toEqual(expected);
  });
});
