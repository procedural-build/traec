export const getGenericReportingPeriods = ({
  url,
  path,
  fromDate = null,
  toDate = null,
  ignore_cache = null,
  extraQueryParams = null,
  keyField = "uid"
}) => {
  const fromDate_ = fromDate ? `fromDate=${fromDate}` : "";
  const toDate_ = toDate ? `toDate=${toDate}` : "";
  const ignoreCache = ignore_cache ? `&ignore_cache=true` : "";
  let queryParams = `?${fromDate_}&${toDate_}${ignoreCache}${extraQueryParams ? `&${extraQueryParams}` : ""}`;

  const fetchParams = {
    method: "GET",
    url: url + queryParams
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addListToDict(path, data, (keyField = keyField));
    return newState;
  };

  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getGenericExcelReport = ({ url, path, fromDate, toDate, ignore_cache, extraQueryParams }) => {
  let { fetchParams } = getGenericReportingPeriods(url, path, fromDate, toDate, ignore_cache, extraQueryParams);

  Object.assign(fetchParams, { headers: { "content-type": "application/xlsx" } });

  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let href = window.URL.createObjectURL(data);
    let newState = state.setInPath(path, href);
    return newState;
  };

  return { fetchParams, stateParams: { stateSetFunc } };
};
