import { handlerMap } from "../src/handlerMap";
import Glob from "glob";
import FS from "fs";

const getHandlerMapProperties = () => {
  let files = Glob.sync(`./src/fetchHandlers/**/*.js`);

  // Read each of the files to get the functions
  let handlerProps = {};
  for (let file of files) {
    let fileString = FS.readFileSync(file) + "";
    let lines = fileString.split("\n");
    for (let line of lines) {
      if (line.includes("apiId")) {
        let apiId = (line.match(/[\"\|\'].*[\"\|\']/) + "").slice(1, -1);
        let parts = apiId.split("_");
        let endIndex = apiId.endsWith("partial_update") ? parts.length - 2 : parts.length - 1;
        let prefix = parts.slice(1, endIndex).join("_");
        if (!prefix) {
          continue;
        }
        let action = parts.slice(endIndex, parts.length).join("_");
        // Add the action
        let actionMap = {
          create: "post",
          update: "put",
          partial_update: "patch"
        };
        handlerProps[prefix] = (handlerProps[prefix] || []).concat([actionMap[action] || action]);
      }
    }
  }
  return handlerProps;
};

describe("handlerMap", () => {
  it("should contain all defined endpoints", () => {
    let handlerProperties = getHandlerMapProperties();
    for (let key in handlerProperties) {
      for (let restCall of handlerProperties[key]) {
        console.log(key, restCall);
        expect(handlerMap[key]).toHaveProperty(restCall);
      }
    }
  });
});
