import * as middleware from "../src/redux/apiMiddleware";

describe("Response Types", () => {
  it("should handle default type", () => {
    const APICall = {
      defaultType: "ENTITY_SET_FUNC"
    };
    const expectedBody = {
      failureType: "ENTITY_SET_FUNC",
      successType: "ENTITY_SET_FUNC"
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

describe("Failure Handler", () => {
  it("should handle default type", () => {
    const APICall = {
      defaultType: "ENTITY_SET_FUNC"
    };
    const expectedBody = {
      failureType: "ENTITY_SET_FUNC",
      successType: "ENTITY_SET_FUNC"
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

describe("SuccessHandler", () => {
  it("should handle default type", () => {
    // mock out dispatch and check how many times it is called
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

describe("check Throttling", () => {
  it("should handle default type", () => {
    const APICall = {
      defaultType: "ENTITY_SET_FUNC"
    };
    const expectedBody = {
      failureType: "ENTITY_SET_FUNC",
      successType: "ENTITY_SET_FUNC"
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
