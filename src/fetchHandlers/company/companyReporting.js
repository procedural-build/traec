const get_query_string = ({
  fromDate = null,
  toDate = null,
  ignore_cache = false,
  summary_cumulation_period = null,
  include_project_results = false,
  format = null
}) => {
  const fromDate_ = fromDate ? `fromDate=${fromDate}` : "";
  const toDate_ = toDate ? `toDate=${toDate}` : "";
  const ignoreCache = ignore_cache ? `&ignore_cache=true` : "";
  const summaryCumulationPeriod = summary_cumulation_period ? "&summary_cumulation_period=total" : "";
  const include_project_results_ = include_project_results ? `&include_project_results=true` : "";
  const format_ = format ? `&output_format=${format}` : "";
  const ignoreSummary = ignore_cache ? `&ignore_summary=true` : "";
  let query_params = `?${fromDate_}&${toDate_}${ignoreCache}${summaryCumulationPeriod}${include_project_results_}${format_}${ignoreSummary}`;
  return query_params;
};

export const getCompanyReportingPeriods = ({
  companyId,
  fromDate = null,
  toDate = null,
  ignore_cache = null,
  include_project_results = null,
  summary_cumulation_period = null,
  format = null,
  ignore_summary = null
}) => {
  let query_params = get_query_string({
    fromDate,
    toDate,
    ignore_cache,
    include_project_results,
    format,
    summary_cumulation_period,
    ignore_summary
  });
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/report/${query_params}`,
    apiId: "api_company_report_list",
    requiredParams: ["companyId"],
    queryParms: {
      fromDate: null,
      toDate: null,
      ignore_cache: false,
      include_project_results: false,
      ignore_summary: false
    }
  };
  let stateSetFunc = (state, action) => {
    let data = action.payload;
    let newState = state;
    for (let item of data) {
      // Handle the parsing of project_results
      let project_result_map = {};
      if (item.project_results) {
        for (let reportPeriod of item.project_results) {
          let categories = {};
          let indicators = {};
          if (reportPeriod.results) {
            for (let result of reportPeriod.results) {
              if (result.category) {
                categories[result.category] = result;
              } else {
                indicators[result.metric_calc] = result;
              }
            }
          }
          reportPeriod.results = { categories, indicators };
          project_result_map[reportPeriod.project.uid] = reportPeriod;
        }
      }
      item.project_results = project_result_map;
      // Add the item into thhe
      newState = newState.addListToDict(`companyReportingPeriods.byId.${companyId}`, [item], "cacheKey");
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
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getCompanyExcelReport = ({
  companyId,
  fromDate = null,
  toDate = null,
  ignore_cache = false,
  summary_cumulation_period = null
}) => {
  let query_params = get_query_string({ fromDate, toDate, ignore_cache, summary_cumulation_period });
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/report/excel/${query_params}`,
    headers: { "content-type": "application/xlsx" },
    apiId: "api_company_report_excel_list",
    requiredParams: ["companyId"],
    queryParms: { fromDate: null, toDate: null, ignore_cache: false }
  };
  const stateSetFunc = (state, action) => {
    return state;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
