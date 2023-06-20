import * as middleware from "../src/redux/apiMiddleware";
import { fetchToState } from "../src/redux/actionCreators";
import { hasFetched } from "../src/redux/fetchCache";
import { fetchJSON } from "../src/redux/fetch";
jest.mock("../src/redux/actionCreators");
jest.mock("../src/redux/fetchCache");

describe("Response Types", () => {
  it("should handle default type", () => {
    const APICall = {
      defaultType: "ENTITY_SET_FUNC",
    };
    const expectedBody = {
      failureType: "ENTITY_SET_FUNC",
      successType: "ENTITY_SET_FUNC",
    };
    expect(middleware.responseTypes(APICall)).toEqual(expectedBody);
  });

  it("should handle success & failure", () => {
    const APICall = { failureType: "LOGIN_FAILURE", successType: "LOGIN_SUCCESS" };
    const expectedBody = { failureType: "LOGIN_FAILURE", successType: "LOGIN_SUCCESS" };

    expect(middleware.responseTypes(APICall)).toEqual(expectedBody);
  });

  it("should throw error if no type", () => {
    const APICall = { defaultType: null };

    expect(() => middleware.responseTypes(APICall)).toThrowError();
  });
});

describe("Record Fetch", () => {
  it("should call dispatch once", () => {
    const fetchParams = {};
    const dispatch = jest.fn();
    const firstCall = {
      type: "FETCH_SET_SENT",
      fetchParams,
    };
    middleware.recordFetch(fetchParams, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(firstCall);
  });
});

describe("Failure Handler", () => {
  it("should call dispatch twice", () => {
    const failureType = "";
    const fetchParams = {};
    const stateParams = {};
    const dispatch = jest.fn();
    const error = "This is an error";

    middleware.failureHandler(error, failureType, fetchParams, stateParams, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("should call dispatch with FETCH_FAIL and failureType", () => {
    const failureType = "FAIL";
    const fetchParams = {};
    const stateParams = {};
    const dispatch = jest.fn();
    const error = "This is an error";
    const firstCall = {
      type: "FETCH_FAIL",
      fetchParams,
      error,
    };
    const secondCall = {
      type: failureType,
      payload: { errors: error },
      stateParams,
      fetchParams,
    };
    middleware.failureHandler(error, failureType, fetchParams, stateParams, dispatch);

    expect(dispatch).toHaveBeenCalledWith(firstCall);
    expect(dispatch).toHaveBeenCalledWith(secondCall);
  });
});

describe("SuccessHandler", () => {
  it("should call dispatch twice", () => {
    // mock out dispatch and check how many times it is called
    const data = {};
    const successType = "";
    const originalBody = {};
    const fetchParams = {};
    const stateParams = {};
    const dispatch = jest.fn();

    middleware.successHandler(data, successType, originalBody, fetchParams, stateParams, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("should call postSuccessHook", () => {
    // mock out postSuccessHook and see if it is called
    const data = {};
    const successType = "";
    const originalBody = {};
    const fetchParams = { postSuccessHook: jest.fn() };
    const stateParams = {};
    const dispatch = jest.fn();

    middleware.successHandler(data, successType, originalBody, fetchParams, stateParams, dispatch);

    expect(fetchParams.postSuccessHook).toHaveBeenCalled();
  });

  it("should dispatch next fetchHandlers", () => {
    // mock out nextHandlers and see if it is called
    fetchToState.mockImplementation((() => Promise.resolve(
      new Response(JSON.stringify({}))
    )));

    const data = {};
    const successType = "";
    const originalBody = {};
    const handler = jest.fn();
    const fetchParams = { nextHandlers: [handler] };
    const stateParams = {};
    const dispatch = jest.fn();

    middleware.successHandler(data, successType, originalBody, fetchParams, stateParams, dispatch);

    expect(fetchParams.nextHandlers[0]).toHaveBeenCalled();
    expect(fetchToState).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it("should dispatch next fetchHandlers and call the postSuccessHook", () => {
    // mock out nextHandlers and see if it is called
    fetchToState.mockImplementation((() => Promise.resolve(
      new Response(JSON.stringify({}))
    )))

    const data = {};
    const successType = "";
    const originalBody = {};
    const handler = jest.fn();
    const fetchParams = { nextHandlers: [handler, handler], postSuccessHook: jest.fn() };
    const stateParams = {};
    const dispatch = jest.fn();

    middleware.successHandler(data, successType, originalBody, fetchParams, stateParams, dispatch);

    expect(fetchParams.nextHandlers[0]).toHaveBeenCalled();
    expect(fetchParams.nextHandlers[1]).toHaveBeenCalled();
    expect(fetchToState).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(fetchParams.postSuccessHook).toHaveBeenCalled();
  });
});

/*
describe("check Throttling", () => {
  const action = "This is an action";
  const getState = jest.fn();
  const fetchParams = {};

  it("if fetched, it should call next", () => {});

  it("if not fetched, it should not do anything", () => {
    spyOn(console, "log");
    hasFetched.mockImplementation((getstate, fetchParams, time) => false);
    middleware.checkThrottling(getState, fetchParams, action);

    expect(hasFetched).toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });
});
*/

describe("apiMiddleware", () => {
  //TODO - Should be tested at a higher level
});
