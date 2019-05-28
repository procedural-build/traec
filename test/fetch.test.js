import { fetchJSON } from "../src/redux/fetch";

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
