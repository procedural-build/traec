import * as fh from "../../src/fetchHandlers";

describe("Fetch Handlers", () => {
  let importedHandlers = Object.keys(fh);

  it("contains getCommitMetricTargets", () => {
    expect(importedHandlers).toContain("getCommitMetricTargets");
  });

  it("contains postCommitMetricTarget", () => {
    expect(importedHandlers).toContain("postCommitMetricTarget");
  });

  it("contains putCommitMetricTarget", () => {
    expect(importedHandlers).toContain("putCommitMetricTarget");
  });

  it("contains patchCommitMetricTarget", () => {
    expect(importedHandlers).toContain("patchCommitMetricTarget");
  });

  it("contains deleteCommitMetricTarget", () => {
    expect(importedHandlers).toContain("deleteCommitMetricTarget");
  });

  it("contains getProjectMembers", () => {
    expect(importedHandlers).toContain("getProjectMembers");
  });

  it("contains deleteProjectMember", () => {
    expect(importedHandlers).toContain("deleteProjectMember");
  });

  it("contains postTree", () => {
    expect(importedHandlers).toContain("postTree");
  });

  it("contains deleteTree", () => {
    expect(importedHandlers).toContain("deleteTree");
  });

  it("contains deleteProjectReportingPeriod", () => {
    expect(importedHandlers).toContain("deleteProjectReportingPeriod");
  });

  it("contains getProjectExcelReport", () => {
    expect(importedHandlers).toContain("getProjectExcelReport");
  });

  it("contains getProjectReportCommits", () => {
    expect(importedHandlers).toContain("getProjectReportCommits");
  });

  it("contains getProjectReportInputValues", () => {
    expect(importedHandlers).toContain("getProjectReportInputValues");
  });

  it("contains getDisciplines", () => {
    expect(importedHandlers).toContain("getDisciplines");
  });

  it("contains postDiscipline", () => {
    expect(importedHandlers).toContain("postDiscipline");
  });

  it("contains putDiscipline", () => {
    expect(importedHandlers).toContain("putDiscipline");
  });

  it("contains deleteDiscipline", () => {
    expect(importedHandlers).toContain("deleteDiscipline");
  });

  it("contains putHead", () => {
    expect(importedHandlers).toContain("putHead");
  });

  it("contains getCommits", () => {
    expect(importedHandlers).toContain("getCommits");
  });

  it("contains postCommit", () => {
    expect(importedHandlers).toContain("postCommit");
  });

  it("contains putCommit", () => {
    expect(importedHandlers).toContain("putCommit");
  });

  it("contains patchCommit", () => {
    expect(importedHandlers).toContain("patchCommit");
  });

  it("contains getAllCommits", () => {
    expect(importedHandlers).toContain("getAllCommits");
  });

  it("contains getTracker", () => {
    expect(importedHandlers).toContain("getTracker");
  });

  it("contains getTrackers", () => {
    expect(importedHandlers).toContain("getTrackers");
  });

  it("contains postTracker", () => {
    expect(importedHandlers).toContain("postTracker");
  });

  it("contains putTracker", () => {
    expect(importedHandlers).toContain("putTracker");
  });

  it("contains patchTracker", () => {
    expect(importedHandlers).toContain("patchTracker");
  });

  it("contains getProjectInvites", () => {
    expect(importedHandlers).toContain("getProjectInvites");
  });

  it("contains postProjectInvite", () => {
    expect(importedHandlers).toContain("postProjectInvite");
  });

  it("contains putProjectInvite", () => {
    expect(importedHandlers).toContain("putProjectInvite");
  });

  it("contains deleteProjectInvite", () => {
    expect(importedHandlers).toContain("deleteProjectInvite");
  });

  it("contains getAllProjectInvites", () => {
    expect(importedHandlers).toContain("getAllProjectInvites");
  });

  it("contains postDescription", () => {
    expect(importedHandlers).toContain("postDescription");
  });

  it("contains getProjects", () => {
    expect(importedHandlers).toContain("getProjects");
  });

  it("contains postProject", () => {
    expect(importedHandlers).toContain("postProject");
  });

  it("contains putProject", () => {
    expect(importedHandlers).toContain("putProject");
  });

  it("contains patchProject", () => {
    expect(importedHandlers).toContain("patchProject");
  });

  it("contains getProject", () => {
    expect(importedHandlers).toContain("getProject");
  });

  it("contains deleteProject", () => {
    expect(importedHandlers).toContain("deleteProject");
  });

  it("contains postDocument", () => {
    expect(importedHandlers).toContain("postDocument");
  });

  it("contains getDocumentObjects", () => {
    expect(importedHandlers).toContain("getDocumentObjects");
  });

  it("contains putDocumentObject", () => {
    expect(importedHandlers).toContain("putDocumentObject");
  });

  it("contains getAllRefs", () => {
    expect(importedHandlers).toContain("getAllRefs");
  });

  it("contains getTrackerRefs", () => {
    expect(importedHandlers).toContain("getTrackerRefs");
  });

  it("contains getRef", () => {
    expect(importedHandlers).toContain("getRef");
  });

  it("contains postCategoryRef", () => {
    expect(importedHandlers).toContain("postCategoryRef");
  });

  it("contains patchCategoryRef", () => {
    expect(importedHandlers).toContain("patchCategoryRef");
  });

  it("contains postRootRef", () => {
    expect(importedHandlers).toContain("postRootRef");
  });

  it("contains getRefBranches", () => {
    expect(importedHandlers).toContain("getRefBranches");
  });

  it("contains postBranch", () => {
    expect(importedHandlers).toContain("postBranch");
  });

  it("contains deleteTrackerRef", () => {
    expect(importedHandlers).toContain("deleteTrackerRef");
  });

  it("contains postBranchFork", () => {
    expect(importedHandlers).toContain("postBranchFork");
  });

  it("contains postProjectAndSetup", () => {
    expect(importedHandlers).toContain("postProjectAndSetup");
  });

  it("contains getProjectAuthGroups", () => {
    expect(importedHandlers).toContain("getProjectAuthGroups");
  });

  it("contains postProjectAuthGroup", () => {
    expect(importedHandlers).toContain("postProjectAuthGroup");
  });

  it("contains putProjectAuthGroup", () => {
    expect(importedHandlers).toContain("putProjectAuthGroup");
  });

  it("contains patchProjectAuthGroup", () => {
    expect(importedHandlers).toContain("patchProjectAuthGroup");
  });

  it("contains getProjectUserPermissions", () => {
    expect(importedHandlers).toContain("getProjectUserPermissions");
  });

  it("contains getCommitEdges", () => {
    expect(importedHandlers).toContain("getCommitEdges");
  });

  it("contains putCommitEdge", () => {
    expect(importedHandlers).toContain("putCommitEdge");
  });

  it("contains edgeDictToState", () => {
    expect(importedHandlers).toContain("edgeDictToState");
  });

  it("contains storeCommitBranch", () => {
    expect(importedHandlers).toContain("storeCommitBranch");
  });

  it("contains storeCommitBranches", () => {
    expect(importedHandlers).toContain("storeCommitBranches");
  });

  it("contains getAllBranches", () => {
    expect(importedHandlers).toContain("getAllBranches");
  });

  it("contains getCommitBranches", () => {
    expect(importedHandlers).toContain("getCommitBranches");
  });

  it("contains getCompanies", () => {
    expect(importedHandlers).toContain("getCompanies");
  });

  it("contains getCompany", () => {
    expect(importedHandlers).toContain("getCompany");
  });

  it("contains postCompany", () => {
    expect(importedHandlers).toContain("postCompany");
  });

  it("contains putCompany", () => {
    expect(importedHandlers).toContain("putCompany");
  });

  it("contains deleteCompany", () => {
    expect(importedHandlers).toContain("deleteCompany");
  });

  it("contains getCompanyAuthGroups", () => {
    expect(importedHandlers).toContain("getCompanyAuthGroups");
  });

  it("contains postCompanyAuthGroup", () => {
    expect(importedHandlers).toContain("postCompanyAuthGroup");
  });

  it("contains putCompanyAuthGroup", () => {
    expect(importedHandlers).toContain("putCompanyAuthGroup");
  });

  it("contains patchCompanyAuthGroup", () => {
    expect(importedHandlers).toContain("patchCompanyAuthGroup");
  });

  it("contains getCompanyUserPermissions", () => {
    expect(importedHandlers).toContain("getCompanyUserPermissions");
  });

  it("contains getCompanyInvites", () => {
    expect(importedHandlers).toContain("getCompanyInvites");
  });

  it("contains postCompanyInvite", () => {
    expect(importedHandlers).toContain("postCompanyInvite");
  });

  it("contains putCompanyInvite", () => {
    expect(importedHandlers).toContain("putCompanyInvite");
  });

  it("contains patchCompanyInvite", () => {
    expect(importedHandlers).toContain("patchCompanyInvite");
  });

  it("contains deleteCompanyInvite", () => {
    expect(importedHandlers).toContain("deleteCompanyInvite");
  });

  it("contains getAllCompanyInvites", () => {
    expect(importedHandlers).toContain("getAllCompanyInvites");
  });

  it("contains getCompanyMembers", () => {
    expect(importedHandlers).toContain("getCompanyMembers");
  });

  it("contains deleteCompanyMember", () => {
    expect(importedHandlers).toContain("deleteCompanyMember");
  });

  it("contains getCompanyReportingPeriods", () => {
    expect(importedHandlers).toContain("getCompanyReportingPeriods");
  });

  it("contains getCompanyExcelReport", () => {
    expect(importedHandlers).toContain("getCompanyExcelReport");
  });

  it("contains postTreeScore", () => {
    expect(importedHandlers).toContain("postTreeScore");
  });

  it("contains postTreeAndMetric", () => {
    expect(importedHandlers).toContain("postTreeAndMetric");
  });

  it("contains postTrackerMetric", () => {
    expect(importedHandlers).toContain("postTrackerMetric");
  });

  it("contains getMetricInputs", () => {
    expect(importedHandlers).toContain("getMetricInputs");
  });

  it("contains postMetricScoreValue", () => {
    expect(importedHandlers).toContain("postMetricScoreValue");
  });

  it("contains putMetricScoreValue", () => {
    expect(importedHandlers).toContain("putMetricScoreValue");
  });

  it("contains postCommitScoreValues", () => {
    expect(importedHandlers).toContain("postCommitScoreValues");
  });

  it("contains patchTreeScore", () => {
    expect(importedHandlers).toContain("patchTreeScore");
  });

  it("contains getConversionFactors", () => {
    expect(importedHandlers).toContain("getConversionFactors");
  });

  it("contains postConversionFactor", () => {
    expect(importedHandlers).toContain("postConversionFactor");
  });

  it("contains putConversionFactor", () => {
    expect(importedHandlers).toContain("putConversionFactor");
  });

  it("contains patchConversionFactor", () => {
    expect(importedHandlers).toContain("patchConversionFactor");
  });
  it("contains patchConversionFactor", () => {
    expect(importedHandlers).toContain("patchConversionFactor");
  });

  it("contains getCompanyTargets", () => {
    expect(importedHandlers).toContain("getCompanyTargets");
  });

  it("contains postCompanyTarget", () => {
    expect(importedHandlers).toContain("postCompanyTarget");
  });

  it("contains putCompanyTarget", () => {
    expect(importedHandlers).toContain("putCompanyTarget");
  });

  it("contains patchCompanyTarget", () => {
    expect(importedHandlers).toContain("patchCompanyTarget");
  });

  it("contains getCompanyIndicators", () => {
    expect(importedHandlers).toContain("getCompanyIndicators");
  });

  it("contains postCompanyIndicator", () => {
    expect(importedHandlers).toContain("postCompanyIndicator");
  });

  it("contains deleteCompanyIndicator", () => {
    expect(importedHandlers).toContain("deleteCompanyIndicator");
  });

  it("contains getCommitIndicators", () => {
    expect(importedHandlers).toContain("getCommitIndicators");
  });

  it("contains postCommitIndicator", () => {
    expect(importedHandlers).toContain("postCommitIndicator");
  });

  it("contains putCommitIndicator", () => {
    expect(importedHandlers).toContain("putCommitIndicator");
  });

  it("contains deleteCommitIndicator", () => {
    expect(importedHandlers).toContain("deleteCommitIndicator");
  });

  it("contains getTreeComments", () => {
    expect(importedHandlers).toContain("getTreeComments");
  });

  it("contains postTreeComment", () => {
    expect(importedHandlers).toContain("postTreeComment");
  });

  it("contains getProjectEmailRecipients", () => {
    expect(importedHandlers).toContain("getProjectEmailRecipients");
  });

  it("contains getProjectEmailRecipient", () => {
    expect(importedHandlers).toContain("getProjectEmailRecipient");
  });

  it("contains putProjectEmailRecipient", () => {
    expect(importedHandlers).toContain("putProjectEmailRecipient");
  });
});
