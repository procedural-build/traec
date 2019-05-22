"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenericExcelReport = exports.getGenericReportingPeriods = void 0;

var getGenericReportingPeriods = function getGenericReportingPeriods(_ref) {
  var url = _ref.url,
      path = _ref.path,
      _ref$fromDate = _ref.fromDate,
      fromDate = _ref$fromDate === void 0 ? null : _ref$fromDate,
      _ref$toDate = _ref.toDate,
      toDate = _ref$toDate === void 0 ? null : _ref$toDate,
      _ref$ignore_cache = _ref.ignore_cache,
      ignore_cache = _ref$ignore_cache === void 0 ? null : _ref$ignore_cache,
      _ref$extraQueryParams = _ref.extraQueryParams,
      extraQueryParams = _ref$extraQueryParams === void 0 ? null : _ref$extraQueryParams,
      _ref$keyField = _ref.keyField,
      keyField = _ref$keyField === void 0 ? "uid" : _ref$keyField;
  var fromDate_ = fromDate ? "fromDate=".concat(fromDate) : '';
  var toDate_ = toDate ? "toDate=".concat(toDate) : '';
  var ignoreCache = ignore_cache ? "&ignore_cache=true" : '';
  var queryParams = "?".concat(fromDate_, "&").concat(toDate_).concat(ignoreCache).concat(extraQueryParams ? "&".concat(extraQueryParams) : '');
  var fetchParams = {
    method: 'GET',
    url: url + queryParams
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state.addListToDict(path, data, keyField = keyField);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getGenericReportingPeriods = getGenericReportingPeriods;

var getGenericExcelReport = function getGenericExcelReport(_ref2) {
  var url = _ref2.url,
      path = _ref2.path,
      fromDate = _ref2.fromDate,
      toDate = _ref2.toDate,
      ignore_cache = _ref2.ignore_cache,
      extraQueryParams = _ref2.extraQueryParams;

  var _getGenericReportingP = getGenericReportingPeriods(url, path, fromDate, toDate, ignore_cache, extraQueryParams),
      fetchParams = _getGenericReportingP.fetchParams;

  Object.assign(fetchParams, {
    headers: {
      "content-type": 'application/xlsx'
    }
  });

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var href = window.URL.createObjectURL(data);
    var newState = state.setInPath(path, href);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getGenericExcelReport = getGenericExcelReport;