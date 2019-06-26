import * as fh from "../../src/fetchHandlers";
import { handlers } from "./actualFetchHandlers";
import Glob from "glob";

const getActualHandlers = () => {
  let files = Glob.sync(`./src/fetchHandlers/**/*.js`);
  console.log("Found all fetchHandler files", files);
  return files;
};

describe("Fetch Handlers", () => {
  console.log("BBBBBBBBBBBBBBB", getActualHandlers());

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
