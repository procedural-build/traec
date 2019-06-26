import * as fh from "../../src/fetchHandlers";
import Glob from "glob";
import FS from "fs";

const getActualHandlers = () => {
  let files = Glob.sync(`./src/fetchHandlers/**/*.js`);

  // Read each of the files to get the functions
  let handlerFunctionNames = new Set();
  for (let file of files) {
    let filestring = FS.readFileSync(file) + "";
    let lines = filestring.split("\n");
    for (let line of lines) {
      if (line.trim().startsWith("export const")) {
        handlerFunctionNames.add(line.split(" ")[2]);
      }
    }
  }
  return handlerFunctionNames;
};

describe("Fetch Handlers", () => {
  let exportedHandlers = new Set(Object.keys(fh));
  let actualHandlers = getActualHandlers();

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
