const get_query_string = ({
  refId = null,
  fromDate = null,
  toDate = null,
  ignore_cache = false,
  exclude_summary = false,
  summary_cumulation_period = null,
  include_commit_results = false,
  format = null
}) => {
  const refId_ = refId ? `&refId=${refId}` : "";
  const fromDate_ = fromDate ? `&fromDate=${fromDate}` : "";
  const toDate_ = toDate ? `&toDate=${toDate}` : "";
  const ignoreCache = ignore_cache ? `&ignore_cache=true` : "";
  const excludeSummary = exclude_summary ? `&exclude_summary=true` : "";
  const summaryCumulationPeriod = summary_cumulation_period ? "&summary_cumulation_period=total" : "";
  const include_commit_results_ = include_commit_results ? `&include_commit_results=true` : "";
  const format_ = format ? `&output_format=${format}` : "";
  let query_params = `?${refId_}${fromDate_}${toDate_}${ignoreCache}${include_commit_results_}${excludeSummary}${summaryCumulationPeriod}${format_}`;
  return query_params;
};

export const getProjectReportingPeriods = ({
  projectId,
  refId = null,
  fromDate = null,
  toDate = null,
  ignore_cache = null,
  exclude_summary = null,
  summary_cumulation_period = null,
  include_commit_results = null,
  format = null
}) => {
  let query_params = get_query_string({
    refId,
    fromDate,
    toDate,
    ignore_cache,
    exclude_summary,
    summary_cumulation_period,
    include_commit_results,
    format
  });
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/reporting_periods/${query_params}`,
    apiId: "api_project_reporting_periods_list",
    requiredParams: ["projectId"],
    queryParms: { fromDate: null, toDate: null, ignore_cache: false }
  };
  let stateSetFunc = (state, action) => {
    let data = action.payload;
    let path = refId
      ? `projectReportingPeriods.ref.${refId}.byId.${projectId}`
      : `projectReportingPeriods.byId.${projectId}`;
    // As the reporting period can hold nested summary data (totals or current values) then merge them in here
    let newState = state;
    for (let item of data) {
      let itemPath = `${path}.${item.uid}`;
      let existingItem = state.getInPath(itemPath);
      if (existingItem) {
        newState = newState.mergeDeepInPath(itemPath, item);
      } else {
        newState = newState.addToDict(path, item);
      }
    }
    return newState;
  };
  // Adjust the headers based on if the format is excel
  if (format == "excel") {
    Object.assign(fetchParams, { headers: { "content-type": "application/xlsx" } });
    stateSetFunc = (state, action) => {
      return state;
    };
  }
  //
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postProjectReportingPeriod = ({ projectId }) => {
  let formVisPath = `ui.projectObjects.byId.${projectId}.reportingPeriod.SHOW_FORM`;
  const fetchParams = {
    method: "POST",
    url: `/api/project/${projectId}/reporting_periods/`,
    apiId: "api_project_reporting_periods_create",
    requiredParams: ["projectId"]
  };
  let stateSetFunc = (state, action) => {
    // This endpoint returns a list of reporting periods that have bee updated
    let data = action.payload;
    let newState = state;
    for (let item of data) {
      newState = newState.mergeInPath(`projectReportingPeriods.byId.${projectId}.${item.uid}`, item);
    }
    // Hide the form
    newState = newState.setInPath(formVisPath, false);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath,
      formObjPath: `ui.projectObjects.byId.${projectId}.reportingPeriod.newItem`
    }
  };
};

export const patchProjectReportingPeriod = ({ projectId, reportingPeriodId }) => {
  let formVisPath = `ui.projectObjects.byId.${projectId}.reportingPeriod.${reportingPeriodId}.SHOW_FORM`;
  const fetchParams = {
    method: "PATCH",
    url: `/api/project/${projectId}/reporting_periods/${reportingPeriodId}/`,
    apiId: "api_project_reporting_periods_partial_update",
    requiredParams: ["projectId", "reportingPeriodId"]
  };
  let stateSetFunc = (state, action) => {
    // This endpoint returns a list of reporting periods that have bee updated
    let data = action.payload;
    let newState = state;
    for (let item of data) {
      newState = newState.mergeInPath(`projectReportingPeriods.byId.${projectId}.${item.uid}`, item);
    }
    // Hide the form
    newState = newState.setInPath(formVisPath, false);
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath,
      formObjPath: `ui.projectObjects.byId.${projectId}.reportingPeriod.${reportingPeriodId}.newItem`
    }
  };
};

export const deleteProjectReportingPeriod = ({ projectId, reportingPeriodId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/project/${projectId}/reporting_periods/${reportingPeriodId}/`,
    apiId: "api_project_reporting_periods_delete",
    requiredParams: ["projectId", "reportingPeriodId"]
  };
  let stateSetFunc = (state, action) => {
    return state.removeInPath(`projectReportingPeriods.byId.${projectId}.${reportingPeriodId}`);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getProjectExcelReport = ({
  projectId,
  refId = null,
  fromDate = null,
  toDate = null,
  ignore_cache = false
}) => {
  let query_params = get_query_string({ refId, fromDate, toDate, ignore_cache, excludeSummary: null, format: "excel" });
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/reporting_periods/excel/${query_params}`,
    headers: { "content-type": "application/xlsx" },
    apiId: "api_project_reporting_periods_excel_list",
    requiredParams: ["projectId"],
    queryParms: { fromDate: null, toDate: null, ignore_cache: false }
  };
  const stateSetFunc = (state, action) => {
    return state;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getProjectReportCommits = ({ projectId, reportPeriodId, category = null, indicator = null }) => {
  let query_params = "";
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/reporting_periods/${reportPeriodId}/commits/${query_params}`,
    apiId: "api_project_reporting_periods_commits_list",
    requiredParams: ["projectId", "reportPeriodId"],
    queryParms: { category: null, indicator: null }
  };
  let stateSetFunc = (state, action) => {
    let data = action.payload;
    let newState = state;
    let path = `projectReportingPeriods.byId.${projectId}.${reportPeriodId}.commit_results`;
    for (let item of data) {
      let categories = {};
      let indicators = {};
      if (item.results) {
        for (let result of item.results) {
          if (result.category) {
            categories[result.category] = result;
          } else {
            indicators[result.metric_calc] = result;
          }
        }
      }
      item.results = { categories, indicators };
      newState = newState.addListToDict(path, item);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getProjectReportInputValues = ({ projectId, reportPeriodId, baseMetricId = null, commitId = null }) => {
  let query_params = "";
  query_params = baseMetricId ? `baseMetricId=${baseMetricId}` : "";
  query_params += commitId ? `commitId=${commitId}` : "";
  query_params = query_params ? "?" + query_params : "";
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/reporting_periods/${reportPeriodId}/inputs/${query_params}`,
    apiId: "api_project_reporting_periods_inputs_list",
    requiredParams: ["projectId", "reportPeriodId"],
    queryParms: { baseMetricId: null }
  };
  let stateSetFunc = (state, action) => {
    let data = action.payload;
    let newState = state;
    for (let item of data) {
      newState = newState.addToDict(`baseMetrics.byId`, item.basemetric);
    }
    newState = newState.addListToDict(`projectReportingPeriods.byId.${projectId}.${reportPeriodId}.input_values`, data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
