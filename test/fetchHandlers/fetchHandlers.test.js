import * as fh from "../../src/fetchHandlers";
import { handlers } from "./actualFetchHandlers";

describe("Fetch Handlers", () => {
  let exportedHandlers = new Set(Object.keys(fh));
  let actualHandlers = new Set(handlers);

  it("There shouldn't be handlers in exportedHandlers that is not in actualHandlers", () => {
    let difference = new Set([...exportedHandlers].filter(x => !actualHandlers.has(x)));
    console.log(difference);

    expect(difference).toEqual(new Set());
  });

  it("There shouldn't be handlers in actualHandlers that is not in exportedHandlers", () => {
    let difference = new Set([...actualHandlers].filter(x => !exportedHandlers.has(x)));
    console.log(difference);

    expect(difference).toEqual(new Set());
  });
});
