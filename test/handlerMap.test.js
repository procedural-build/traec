import { handlerMap } from "../src/handlerMap";
import { handlerProperties } from "./handlerMapProperties";

describe("handlerMap", () => {
  it("should contain all defined endpoints", () => {
    for (let key in handlerProperties) {
      for (let restCall of handlerProperties[key]) {
        console.log(key, restCall);
        expect(handlerMap[key]).toHaveProperty(restCall);
      }
    }
    //expect(handlerMap.company).toHaveProperty("delete");
    //expect(handlerMap.company).toHaveProperty("list");
    //expect(handlerMap.company).toHaveProperty("post");
    //expect(handlerMap.company).toHaveProperty("put");
    //expect(handlerMap.company).toHaveProperty("read");
  });
});
