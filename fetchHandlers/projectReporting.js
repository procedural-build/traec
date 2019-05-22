"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjectExcelReport = exports.deleteProjectReportingPeriod = exports.getProjectReportingPeriods = void 0;

var get_query_string = function get_query_string(_ref) {
  var _ref$refId = _ref.refId,
      refId = _ref$refId === void 0 ? null : _ref$refId,
      _ref$fromDate = _ref.fromDate,
      fromDate = _ref$fromDate === void 0 ? null : _ref$fromDate,
      _ref$toDate = _ref.toDate,
      toDate = _ref$toDate === void 0 ? null : _ref$toDate,
      _ref$ignore_cache = _ref.ignore_cache,
      ignore_cache = _ref$ignore_cache === void 0 ? false : _ref$ignore_cache,
      _ref$exclude_summary = _ref.exclude_summary,
      exclude_summary = _ref$exclude_summary === void 0 ? false : _ref$exclude_summary,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? null : _ref$format;
  var refId_ = refId ? "&refId=".concat(refId) : '';
  var fromDate_ = fromDate ? "&fromDate=".concat(fromDate) : '';
  var toDate_ = toDate ? "&toDate=".concat(toDate) : '';
  var ignoreCache = ignore_cache ? "&ignore_cache=true" : '';
  var excludeSummary = exclude_summary ? "&exclude_summary=true" : '';
  var format_ = format ? "&output_format=".concat(format) : '';
  var query_params = "?".concat(refId_).concat(fromDate_).concat(toDate_).concat(ignoreCache).concat(excludeSummary).concat(format_);
  return query_params;
};

var getProjectReportingPeriods = function getProjectReportingPeriods(_ref2) {
  var projectId = _ref2.projectId,
      _ref2$refId = _ref2.refId,
      refId = _ref2$refId === void 0 ? null : _ref2$refId,
      _ref2$fromDate = _ref2.fromDate,
      fromDate = _ref2$fromDate === void 0 ? null : _ref2$fromDate,
      _ref2$toDate = _ref2.toDate,
      toDate = _ref2$toDate === void 0 ? null : _ref2$toDate,
      _ref2$ignore_cache = _ref2.ignore_cache,
      ignore_cache = _ref2$ignore_cache === void 0 ? null : _ref2$ignore_cache,
      _ref2$exclude_summary = _ref2.exclude_summary,
      exclude_summary = _ref2$exclude_summary === void 0 ? null : _ref2$exclude_summary,
      _ref2$format = _ref2.format,
      format = _ref2$format === void 0 ? null : _ref2$format;
  var query_params = get_query_string({
    refId: refId,
    fromDate: fromDate,
    toDate: toDate,
    ignore_cache: ignore_cache,
    exclude_summary: exclude_summary,
    format: format
  });
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/reporting_periods/").concat(query_params),
    apiId: 'api_project_reporting_periods_list',
    requiredParams: ['projectId'],
    queryParms: {
      fromDate: null,
      toDate: null,
      ignore_cache: false
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var path = refId ? "projectReportingPeriods.ref.".concat(refId, ".byId.").concat(projectId) : "projectReportingPeriods.byId.".concat(projectId);
    return state.addListToDict(path, data);
  }; // Adjust the headers based on if the format is excel


  if (format == 'excel') {
    Object.assign(fetchParams, {
      headers: {
        "content-type": 'application/xlsx'
      }
    });

    stateSetFunc = function stateSetFunc(state, action) {
      return state;
    };
  } //


  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjectReportingPeriods = getProjectReportingPeriods;

var deleteProjectReportingPeriod = function deleteProjectReportingPeriod(_ref3) {
  var projectId = _ref3.projectId,
      reportingPeriodId = _ref3.reportingPeriodId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/project/".concat(projectId, "/reporting_periods/").concat(reportingPeriodId, "/"),
    apiId: 'api_project_reporting_periods_delete',
    requiredParams: ['projectId', 'reportingPeriodId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    return state.removeInPath("projectReportingPeriods.byId.".concat(projectId, ".").concat(reportingPeriodId));
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteProjectReportingPeriod = deleteProjectReportingPeriod;

var getProjectExcelReport = function getProjectExcelReport(_ref4) {
  var projectId = _ref4.projectId,
      _ref4$refId = _ref4.refId,
      refId = _ref4$refId === void 0 ? null : _ref4$refId,
      _ref4$fromDate = _ref4.fromDate,
      fromDate = _ref4$fromDate === void 0 ? null : _ref4$fromDate,
      _ref4$toDate = _ref4.toDate,
      toDate = _ref4$toDate === void 0 ? null : _ref4$toDate,
      _ref4$ignore_cache = _ref4.ignore_cache,
      ignore_cache = _ref4$ignore_cache === void 0 ? false : _ref4$ignore_cache;
  var query_params = get_query_string({
    refId: refId,
    fromDate: fromDate,
    toDate: toDate,
    ignore_cache: ignore_cache,
    excludeSummary: null,
    format: 'excel'
  });
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/reporting_periods/excel/").concat(query_params),
    headers: {
      "content-type": 'application/xlsx'
    },
    apiId: 'api_project_reporting_periods_excel_list',
    requiredParams: ['projectId'],
    queryParms: {
      fromDate: null,
      toDate: null,
      ignore_cache: false
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    return state;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getProjectExcelReport = getProjectExcelReport;