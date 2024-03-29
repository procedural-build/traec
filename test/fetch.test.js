import { fetchJSON, updateHeaders, updateBody, checkResponse } from "../src/redux/fetch";

describe("Update fetch body", () => {
  it("Stringify the body", () => {
    const expectedBody = '{"key":"value"}';

    expect(updateBody({ key: "value" }, false)).toEqual(expectedBody);
  });

  it("With rawBody", () => {
    const expectedBody = { key: "value" };

    expect(updateBody({ key: "value" }, true)).toEqual(expectedBody);
  });
});

describe("Update headers", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  const token = "glskfhgklsjhfgsjh";

  it("No token, empty headers", () => {
    const expectedHeaders = { "content-type": "application/json" };

    expect(updateHeaders({})).toEqual(expectedHeaders);
  });

  it("Token, empty headers", () => {
    localStorage.setItem("token", token);
    const expectedHeaders = { "content-type": "application/json", Authorization: `JWT ${token}` };

    expect(updateHeaders({})).toEqual(expectedHeaders);
  });

  it("Token, json headers", () => {
    localStorage.setItem("token", token);
    const expectedHeaders = { "content-type": "application/json", Authorization: `JWT ${token}` };

    expect(updateHeaders({ "content-type": "application/json" })).toEqual(expectedHeaders);
  });

  it("Token, null headers", () => {
    localStorage.setItem("token", token);
    const expectedHeaders = { Authorization: `JWT ${token}` };

    expect(updateHeaders({ "content-type": null })).toEqual(expectedHeaders);
  });

  afterAll(() => {
    localStorage.clear();
  });
});

describe("check Responses", () => {
  it("ok response", () => {
    const resp = {
      ok: true,
      status: 200,
      json: jest.fn().mockReturnValue(true)
    };

    expect(checkResponse(resp, {})).toEqual(true);
  });

  it("204 response", () => {
    const resp = {
      ok: true,
      status: 204,
      json: jest.fn().mockReturnValue(true)
    };

    expect(checkResponse(resp, {})).toEqual({});
  });

  it("404 response", () => {
    const resp = {
      ok: false,
      status: 404,
      json: jest.fn().mockReturnValue(true)
    };

    expect(() => {
      checkResponse(resp, {});
    }).toThrow();
  });

  it("xlsx header", () => {
    const myBlob = new Blob();
    const init = { status: 200, statusText: "SuperSmashingGreat!" };
    const resp = new Response(myBlob, init);

    expect(checkResponse(resp, { "content-type": "application/xlsx" })).toEqual(resp.blob());
  });
});

describe("fetchJSON", () => {
  //TODO - Needs a test
  beforeEach(() => {
    fetch.resetMocks();
  });

  let success = jest.fn();
  let failure = jest.fn();

  it("should fetch successfully", () => {
    const resp = {
      type: "basic",
      url: "http://0.0.0.0:8080/auth-jwt/get/",
      redirected: false,
      status: 200,
      ok: true,
      statusText: "OK",
      headers: {},
      body: {},
      bodyUsed: false
    };
    fetch.mockResponse(() => Promise.resolve(
      new Response(JSON.stringify(resp))
    ))
    fetchJSON({ url: "/api/test" }, success, failure);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0]).toEqual([
      "/api/test",
      {
        method: "GET",
        headers: {
          "content-type": "application/json"
        },
        body: undefined
      }
    ]);
  });

  it("should fetch unsuccesfully", () => {
    const resp = {
      type: "basic",
      url: "http://0.0.0.0:8080/auth-jwt/get/",
      redirected: false,
      status: 404,
      ok: false,
      statusText: "NOPE!",
      headers: {},
      body: {},
      bodyUsed: false
    };
    fetch.mockReject(JSON.stringify(resp));
    fetchJSON({ url: "/api/bad-test" }, success, failure);

    expect(fetch).toHaveBeenCalled();
    expect(fetch.mock.calls[0]).toEqual([
      "/api/bad-test",
      {
        method: "GET",
        headers: {
          "content-type": "application/json"
        },
        body: undefined
      }
    ]);
  });
});
