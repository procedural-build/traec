"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompanyExcelReport = exports.getCompanyReportingPeriods = void 0;

var get_query_string = function get_query_string(_ref) {
  var _ref$fromDate = _ref.fromDate,
      fromDate = _ref$fromDate === void 0 ? null : _ref$fromDate,
      _ref$toDate = _ref.toDate,
      toDate = _ref$toDate === void 0 ? null : _ref$toDate,
      _ref$ignore_cache = _ref.ignore_cache,
      ignore_cache = _ref$ignore_cache === void 0 ? false : _ref$ignore_cache,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? null : _ref$format;
  var fromDate_ = fromDate ? "fromDate=".concat(fromDate) : '';
  var toDate_ = toDate ? "toDate=".concat(toDate) : '';
  var ignoreCache = ignore_cache ? "&ignore_cache=true" : '';
  var format_ = format ? "&output_format=".concat(format) : '';
  var query_params = "?".concat(fromDate_, "&").concat(toDate_).concat(ignoreCache).concat(format_);
  return query_params;
};

var getCompanyReportingPeriods = function getCompanyReportingPeriods(_ref2) {
  var companyId = _ref2.companyId,
      _ref2$fromDate = _ref2.fromDate,
      fromDate = _ref2$fromDate === void 0 ? null : _ref2$fromDate,
      _ref2$toDate = _ref2.toDate,
      toDate = _ref2$toDate === void 0 ? null : _ref2$toDate,
      _ref2$ignore_cache = _ref2.ignore_cache,
      ignore_cache = _ref2$ignore_cache === void 0 ? null : _ref2$ignore_cache,
      _ref2$format = _ref2.format,
      format = _ref2$format === void 0 ? null : _ref2$format;
  var query_params = get_query_string({
    fromDate: fromDate,
    toDate: toDate,
    ignore_cache: ignore_cache,
    format: format
  });
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/report/").concat(query_params),
    apiId: 'api_company_report_list',
    requiredParams: ['companyId'],
    queryParms: {
      fromDate: null,
      toDate: null,
      ignore_cache: false
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return state.addListToDict("companyReportingPeriods.byId.".concat(companyId), data, "cacheKey");
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
  }

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyReportingPeriods = getCompanyReportingPeriods;

var getCompanyExcelReport = function getCompanyExcelReport(_ref3) {
  var companyId = _ref3.companyId,
      _ref3$fromDate = _ref3.fromDate,
      fromDate = _ref3$fromDate === void 0 ? null : _ref3$fromDate,
      _ref3$toDate = _ref3.toDate,
      toDate = _ref3$toDate === void 0 ? null : _ref3$toDate,
      _ref3$ignore_cache = _ref3.ignore_cache,
      ignore_cache = _ref3$ignore_cache === void 0 ? false : _ref3$ignore_cache;
  var query_params = get_query_string({
    fromDate: fromDate,
    toDate: toDate,
    ignore_cache: ignore_cache
  });
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/report/excel/").concat(query_params),
    headers: {
      "content-type": 'application/xlsx'
    },
    apiId: 'api_company_report_excel_list',
    requiredParams: ['companyId'],
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

exports.getCompanyExcelReport = getCompanyExcelReport;