import * as fh from "../../../src/fetchHandlers";

describe("getProjectEmails", () => {
  it("contains getProjectEmails", () => {
    const projectId = "test_project_id";
    const projectEmails = fh.getProjectEmails({ projectId });

    const fetchParams = {
      method: "GET",
      url: `/api/project/${projectId}/email/recipient`,
      apiId: "api_project_email_recipient_list",
      requiredParams: ["projectId"]
    };
    expect(projectEmails).toHaveProperty("fetchParams");
    expect(projectEmails).toHaveProperty("stateParams");
    expect(projectEmails.fetchParams).toMatchObject(fetchParams);
  });
});
