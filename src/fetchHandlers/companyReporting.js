const get_query_string = ({ fromDate = null, toDate = null, ignore_cache = false, format = null }) => {
  const fromDate_ = fromDate ? `fromDate=${fromDate}` : "";
  const toDate_ = toDate ? `toDate=${toDate}` : "";
  const ignoreCache = ignore_cache ? `&ignore_cache=true` : "";
  const format_ = format ? `&output_format=${format}` : "";
  let query_params = `?${fromDate_}&${toDate_}${ignoreCache}${format_}`;
  return query_params;
};

export const getCompanyReportingPeriods = ({
  companyId,
  fromDate = null,
  toDate = null,
  ignore_cache = null,
  format = null
}) => {
  let query_params = get_query_string({ fromDate, toDate, ignore_cache, format });
  const fetchParams = {
    method: "GET",
    url: `/api/company/${companyId}/report/${query_params}`,
    apiId: "api_company_report_list",
    requiredParams: ["companyId"],
    queryParms: { fromDate: null, toDate: null, ignore_cache: false }
  };
  let stateSetFunc = (state, action) => {
    let data = action.payload;
    return state.addListToDict(`companyReportingPeriods.byId.${companyId}`, data, "cacheKey");
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

export const getCompanyExcelReport = ({ companyId, fromDate = null, toDate = null, ignore_cache = false }) => {
  let query_params = get_query_string({ fromDate, toDate, ignore_cache });
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
