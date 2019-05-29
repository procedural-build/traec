import * as middleware from "../src/redux/apiMiddleware";
import { updateBody } from "../src/redux/fetch";

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
