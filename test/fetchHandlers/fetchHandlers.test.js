import * as fh from "../../src/fetchHandlers";

describe("Fetch Handlers", () => {
  let importedHandlers = Object.keys(fh);
  it("contains getProjectEmailRecipient", () => {
    expect(importedHandlers).toContain("getProjectEmailRecipient");
  });

  it("contains getProjectEmailRecipients", () => {
    expect(importedHandlers).toContain("getProjectEmailRecipients");
  });
});
