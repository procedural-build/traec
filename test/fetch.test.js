import { fetchJSON, updateHeaders, updateBody, checkResponse } from "../src/redux/fetch";

describe("Call fetchJSON", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const config = { path: "/api/test", method: "GET", body: "TEST" };
  it("Call fetchJSON and expect an API call", () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "12345" }));

    fetchJSON(config).then(res => {
      expect(res.data).toEqual(expectedAction);
    });
  });
});

describe("Update fetch body", () => {
  it("Stringify the body", () => {
    const expectedBody = '{"key":"value"}';

    expect(updateBody({ key: "value" })).toEqual(expectedBody);
  });

  it("With rawBody", () => {
    const expectedBody = { key: "value" };

    expect(updateBody({ key: "value" }, true)).toEqual(expectedBody, true);
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

    expect(updateHeaders({}, true)).toEqual(expectedHeaders, true);
  });

  it("Token, json headers", () => {
    localStorage.setItem("token", token);
    const expectedHeaders = { "content-type": "application/json", Authorization: `JWT ${token}` };

    expect(updateHeaders({ "content-type": "application/json" }, true)).toEqual(expectedHeaders, true);
  });

  it("Token, null headers", () => {
    localStorage.setItem("token", token);
    const expectedHeaders = { Authorization: `JWT ${token}` };

    expect(updateHeaders({ "content-type": null }, true)).toEqual(expectedHeaders, true);
  });
});
