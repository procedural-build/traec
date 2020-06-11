import * as fh from "../../../src/fetchHandlers";

describe("getProjectReportingPeriods", () => {
  it("contains fetchParams and stateParams", () => {
    const projectId = "test_project_id";
    const reportingPeriods = fh.getProjectReportingPeriods({ projectId });

    const fetchParams = {
      method: "GET",
      url: `/api/project/${projectId}/reporting_periods/?`,
      apiId: "api_project_reporting_periods_list",
      requiredParams: ["projectId"],
      queryParms: { fromDate: null, toDate: null, ignore_cache: false }
    };
    expect(reportingPeriods).toHaveProperty("fetchParams");
    expect(reportingPeriods).toHaveProperty("stateParams");
    expect(reportingPeriods.fetchParams).toMatchObject(fetchParams);
  });
});

xdescribe("getProjectReportingPeriods", () => {
  it("should handle cumulative values", () => {
    const projectId = "test_project_id";
    const reportingPeriods = fh.getProjectReportingPeriods({ projectId, cumPeriod: "total" });

    const fetchParams = {
      method: "GET",
      url: `/api/project/${projectId}/reporting_periods/?&cum_period=total`,
      apiId: "api_project_reporting_periods_list",
      requiredParams: ["projectId"],
      queryParms: { fromDate: null, toDate: null, ignore_cache: false, cumPeriod: null }
    };
    expect(reportingPeriods).toHaveProperty("fetchParams");
    expect(reportingPeriods).toHaveProperty("stateParams");
    expect(reportingPeriods.fetchParams).toMatchObject(fetchParams);
  });
});
