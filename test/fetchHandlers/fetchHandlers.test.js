import * as fh from "../../src/fetchHandlers";

describe("Fetch Handlers", () => {
  let importedHandlers = Object.keys(fh);
  it("contains getProjectEmails", () => {
    expect(importedHandlers).toContain("getProjectEmails");
  });
});
