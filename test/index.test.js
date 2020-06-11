import Traec from "../src";

describe("Traec", () => {
  let importedHandlers = Object.keys(Traec);

  it("contains FetchHandlers", () => {
    expect(importedHandlers).toContain("fetchHandlers");
  });

  it("contains fetchBindings", () => {
    expect(importedHandlers).toContain("fetchBindings");
  });

  it("contains handlerMap", () => {
    expect(importedHandlers).toContain("handlerMap");
  });

  it("contains fetchRequired", () => {
    expect(importedHandlers).toContain("fetchRequired");
  });

  it("contains Fetch", () => {
    expect(importedHandlers).toContain("Fetch");
  });

  it("contains Im", () => {
    expect(importedHandlers).toContain("Im");
  });

  it("contains Redux", () => {
    expect(importedHandlers).toContain("Redux");
  });
});
