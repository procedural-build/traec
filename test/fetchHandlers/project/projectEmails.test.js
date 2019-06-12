import * as fh from "../../../src/fetchHandlers";

describe("getProjectEmailRecipients", () => {
  it("contains fetchParams and stateParams", () => {
    const projectId = "test_project_id";
    const projectEmails = fh.getProjectEmailRecipients({ projectId });

    const fetchParams = {
      method: "GET",
      url: `/api/project/${projectId}/email/recipient/`,
      apiId: "api_project_email_recipient_list",
      requiredParams: ["projectId"]
    };
    expect(projectEmails).toHaveProperty("fetchParams");
    expect(projectEmails).toHaveProperty("stateParams");
    expect(projectEmails.fetchParams).toMatchObject(fetchParams);
  });
});

describe("getProjectEmailRecipient", () => {
  it("contains fetchParams and stateParams", () => {
    const projectId = "test_project_id";
    const recipientId = "test_recipient_id";
    const projectEmails = fh.getProjectEmailRecipient({ projectId, recipientId });

    const fetchParams = {
      method: "GET",
      url: `/api/project/${projectId}/email/recipient/test_recipient_id/`,
      apiId: "api_project_email_recipient_read",
      requiredParams: ["projectId"]
    };
    expect(projectEmails).toHaveProperty("fetchParams");
    expect(projectEmails).toHaveProperty("stateParams");
    expect(projectEmails.fetchParams).toMatchObject(fetchParams);
  });
});
