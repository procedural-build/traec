import { handlerMap } from "../src/handlerMap";

describe("handlerMap", () => {
  it("should contain company endpoints", () => {
    expect(handlerMap.company).toHaveProperty("delete");
    expect(handlerMap.company).toHaveProperty("list");
    expect(handlerMap.company).toHaveProperty("post");
    expect(handlerMap.company).toHaveProperty("put");
    expect(handlerMap.company).toHaveProperty("read");
  });

  it("should contain company_authgroup endpoints", () => {
    expect(handlerMap.company_authgroup).toHaveProperty("list");
    expect(handlerMap.company_authgroup).toHaveProperty("patch");
    expect(handlerMap.company_authgroup).toHaveProperty("post");
    expect(handlerMap.company_authgroup).toHaveProperty("put");
  });

  it("should contain company_indicator endpoints", () => {
    expect(handlerMap.company_indicator).toHaveProperty("delete");
    expect(handlerMap.company_indicator).toHaveProperty("list");
    expect(handlerMap.company_indicator).toHaveProperty("post");
  });

  it("should contain company_invite endpoints", () => {
    expect(handlerMap.company_invite).toHaveProperty("delete");
    expect(handlerMap.company_invite).toHaveProperty("list");
    expect(handlerMap.company_invite).toHaveProperty("patch");
    expect(handlerMap.company_invite).toHaveProperty("post");
    expect(handlerMap.company_invite).toHaveProperty("put");
  });

  it("should contain company_invite_all endpoints", () => {
    expect(handlerMap.company_invite_all).toHaveProperty("list");
  });

  it("should contain company_member endpoints", () => {
    expect(handlerMap.company_member).toHaveProperty("delete");
    expect(handlerMap.company_member).toHaveProperty("list");
  });

  it("should contain company_permission endpoints", () => {
    expect(handlerMap.company_permission).toHaveProperty("list");
  });

  it("should contain company_report endpoints", () => {
    expect(handlerMap.company_report).toHaveProperty("list");
  });

  it("should contain company_report_excel endpoints", () => {
    expect(handlerMap.company_report_excel).toHaveProperty("list");
  });

  it("should contain company_target endpoints", () => {
    expect(handlerMap.company_target).toHaveProperty("list");
    expect(handlerMap.company_target).toHaveProperty("patch");
    expect(handlerMap.company_target).toHaveProperty("post");
    expect(handlerMap.company_target).toHaveProperty("put");
  });

  it("should contain project endpoints", () => {
    expect(handlerMap.project).toHaveProperty("delete");
    expect(handlerMap.project).toHaveProperty("list");
    expect(handlerMap.project).toHaveProperty("patch");
    expect(handlerMap.project).toHaveProperty("post");
    expect(handlerMap.project).toHaveProperty("put");
    expect(handlerMap.project).toHaveProperty("read");
  });

  it("should contain project_and_setup endpoints", () => {
    expect(handlerMap.project_and_setup).toHaveProperty("post");
  });

  it("should contain project_authgroup endpoints", () => {
    expect(handlerMap.project_authgroup).toHaveProperty("list");
    expect(handlerMap.project_authgroup).toHaveProperty("patch");
    expect(handlerMap.project_authgroup).toHaveProperty("post");
    expect(handlerMap.project_authgroup).toHaveProperty("put");
  });

  it("should contain project_discipline endpoints", () => {
    expect(handlerMap.project_discipline).toHaveProperty("delete");
    expect(handlerMap.project_discipline).toHaveProperty("list");
    expect(handlerMap.project_discipline).toHaveProperty("post");
    expect(handlerMap.project_discipline).toHaveProperty("put");
  });

  it("should contain project_email_recipient endpoints", () => {
    expect(handlerMap.project_email_recipient).toHaveProperty("list");
    expect(handlerMap.project_email_recipient).toHaveProperty("patch");
    expect(handlerMap.project_email_recipient).toHaveProperty("put");
    expect(handlerMap.project_email_recipient).toHaveProperty("read");
  });

  it("should contain project_invite endpoints", () => {
    expect(handlerMap.project_invite).toHaveProperty("delete");
    expect(handlerMap.project_invite).toHaveProperty("list");
    expect(handlerMap.project_invite).toHaveProperty("post");
    expect(handlerMap.project_invite).toHaveProperty("put");
  });

  it("should contain project_invite_all endpoints", () => {
    expect(handlerMap.project_invite_all).toHaveProperty("list");
  });

  it("should contain project_member endpoints", () => {
    expect(handlerMap.project_member).toHaveProperty("delete");
    expect(handlerMap.project_member).toHaveProperty("list");
  });

  it("should contain project_permission endpoints", () => {
    expect(handlerMap.project_permission).toHaveProperty("list");
  });

  it("should contain project_reporting_periods endpoints", () => {
    expect(handlerMap.project_reporting_periods).toHaveProperty("delete");
    expect(handlerMap.project_reporting_periods).toHaveProperty("list");
  });

  it("should contain project_reporting_periods_commits endpoints", () => {
    expect(handlerMap.project_reporting_periods_commits).toHaveProperty("list");
  });

  it("should contain project_reporting_periods_excel endpoints", () => {
    expect(handlerMap.project_reporting_periods_excel).toHaveProperty("list");
  });

  it("should contain project_reporting_periods_inputs endpoints", () => {
    expect(handlerMap.project_reporting_periods_inputs).toHaveProperty("list");
  });

  it("should contain project_tracker endpoints", () => {
    expect(handlerMap.project_tracker).toHaveProperty("list");
  });

  it("should contain tracker endpoints", () => {
    expect(handlerMap.tracker).toHaveProperty("list");
    expect(handlerMap.tracker).toHaveProperty("patch");
    expect(handlerMap.tracker).toHaveProperty("post");
    expect(handlerMap.tracker).toHaveProperty("put");
    expect(handlerMap.tracker).toHaveProperty("read");
  });

  it("should contain tracker_branch endpoints", () => {
    expect(handlerMap.tracker_branch).toHaveProperty("list");
  });

  it("should contain tracker_commit_all endpoints", () => {
    expect(handlerMap.tracker_commit_all).toHaveProperty("list");
  });

  it("should contain tracker_commit_branch endpoints", () => {
    expect(handlerMap.tracker_commit_branch).toHaveProperty("list");
  });

  it("should contain tracker_commit_convfactor endpoints", () => {
    expect(handlerMap.tracker_commit_convfactor).toHaveProperty("list");
    expect(handlerMap.tracker_commit_convfactor).toHaveProperty("patch");
    expect(handlerMap.tracker_commit_convfactor).toHaveProperty("post");
    expect(handlerMap.tracker_commit_convfactor).toHaveProperty("put");
  });

  it("should contain tracker_commit_document_object endpoints", () => {
    expect(handlerMap.tracker_commit_document_object).toHaveProperty("put");
  });

  it("should contain tracker_commit_edge endpoints", () => {
    expect(handlerMap.tracker_commit_edge).toHaveProperty("put");
    expect(handlerMap.tracker_commit_edge).toHaveProperty("read");
  });

  it("should contain tracker_commit_indicator endpoints", () => {
    expect(handlerMap.tracker_commit_indicator).toHaveProperty("delete");
    expect(handlerMap.tracker_commit_indicator).toHaveProperty("list");
    expect(handlerMap.tracker_commit_indicator).toHaveProperty("post");
    expect(handlerMap.tracker_commit_indicator).toHaveProperty("put");
  });

  it("should contain tracker_commit_score_value endpoints", () => {
    expect(handlerMap.tracker_commit_score_value).toHaveProperty("post");
    expect(handlerMap.tracker_commit_score_value).toHaveProperty("put");
  });

  it("should contain tracker_commit_target endpoints", () => {
    expect(handlerMap.tracker_commit_target).toHaveProperty("delete");
    expect(handlerMap.tracker_commit_target).toHaveProperty("list");
    expect(handlerMap.tracker_commit_target).toHaveProperty("patch");
    expect(handlerMap.tracker_commit_target).toHaveProperty("post");
    expect(handlerMap.tracker_commit_target).toHaveProperty("put");
  });

  it("should contain tracker_commit_tree_comment endpoints", () => {
    expect(handlerMap.tracker_commit_tree_comment).toHaveProperty("list");
    expect(handlerMap.tracker_commit_tree_comment).toHaveProperty("post");
  });

  it("should contain tracker_commit_value endpoints", () => {
    expect(handlerMap.tracker_commit_value).toHaveProperty("list");
    expect(handlerMap.tracker_commit_value).toHaveProperty("post");
  });

  it("should contain tracker_ref endpoints", () => {
    expect(handlerMap.tracker_ref).toHaveProperty("delete");
    expect(handlerMap.tracker_ref).toHaveProperty("list");
    expect(handlerMap.tracker_ref).toHaveProperty("patch");
    expect(handlerMap.tracker_ref).toHaveProperty("post");
    expect(handlerMap.tracker_ref).toHaveProperty("read");
  });

  it("should contain tracker_ref_all endpoints", () => {
    expect(handlerMap.tracker_ref_all).toHaveProperty("list");
  });

  it("should contain tracker_ref_commit endpoints", () => {
    expect(handlerMap.tracker_ref_commit).toHaveProperty("list");
    expect(handlerMap.tracker_ref_commit).toHaveProperty("patch");
    expect(handlerMap.tracker_ref_commit).toHaveProperty("post");
    expect(handlerMap.tracker_ref_commit).toHaveProperty("put");
  });

  it("should contain tracker_ref_document endpoints", () => {
    expect(handlerMap.tracker_ref_document).toHaveProperty("put");
  });

  it("should contain tracker_ref_head endpoints", () => {
    expect(handlerMap.tracker_ref_head).toHaveProperty("put");
  });

  it("should contain tracker_ref_submodule endpoints", () => {
    expect(handlerMap.tracker_ref_submodule).toHaveProperty("list");
  });

  it("should contain tracker_ref_tree endpoints", () => {
    expect(handlerMap.tracker_ref_tree).toHaveProperty("delete");
    expect(handlerMap.tracker_ref_tree).toHaveProperty("post");
  });

  it("should contain tracker_ref_tree_branch endpoints", () => {
    expect(handlerMap.tracker_ref_tree_branch).toHaveProperty("post");
  });

  it("should contain tracker_ref_tree_document endpoints", () => {
    expect(handlerMap.tracker_ref_tree_document).toHaveProperty("post");
  });

  it("should contain tracker_ref_tree_score endpoints", () => {
    expect(handlerMap.tracker_ref_tree_score).toHaveProperty("patch");
  });

  it("should contain tracker_ref_tree_tree endpoints", () => {
    expect(handlerMap.tracker_ref_tree_tree).toHaveProperty("post");
  });

  it("should contain tracker_ref_tree_tree_and_metric endpoints", () => {
    expect(handlerMap.tracker_ref_tree_tree_and_metric).toHaveProperty("post");
  });
});
