"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCompanyIndicator = exports.postCompanyIndicator = exports.getCompanyIndicators = void 0;

var baseMetricsToState = function baseMetricsToState(state, item) {
  var baseMetrics = item.baseMetrics || [];
  return state.addListToDict("baseMetrics.byId", baseMetrics);
};

var getCompanyIndicators = function getCompanyIndicators(_ref) {
  var companyId = _ref.companyId,
      _ref$allAvailable = _ref.allAvailable,
      allAvailable = _ref$allAvailable === void 0 ? false : _ref$allAvailable;
  var query_params = allAvailable ? "?allAvailable=true" : '';
  var fetchParams = {
    method: 'GET',
    url: "/api/company/".concat(companyId, "/indicator/").concat(query_params),
    apiId: 'api_company_indicator_list',
    requiredParams: ['companyId'],
    queryParams: {
      allAvailable: false
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var pathEnd = allAvailable ? 'availableIndicators' : 'indicators';
    var path = "companyObjects.byId.".concat(companyId, ".").concat(pathEnd); // Save the baseMetrics

    var newState = state;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        newState = baseMetricsToState(newState, item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    newState = newState.addListToDict(path, data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getCompanyIndicators = getCompanyIndicators;

var postCompanyIndicator = function postCompanyIndicator(_ref2) {
  var companyId = _ref2.companyId,
      _ref2$fromExistingId = _ref2.fromExistingId,
      fromExistingId = _ref2$fromExistingId === void 0 ? null : _ref2$fromExistingId;
  var query_params = fromExistingId ? "?fromExisting=".concat(fromExistingId) : '';
  var fetchParams = {
    method: 'POST',
    url: "/api/company/".concat(companyId, "/indicator/").concat(query_params),
    apiId: 'api_company_indicator_create',
    requiredParams: ['companyId'],
    queryParams: {
      fromExistingId: null
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = baseMetricsToState(state, data);
    return newState.addListToDict("companyObjects.byId.".concat(companyId, ".indicators"), [data]);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postCompanyIndicator = postCompanyIndicator;

var deleteCompanyIndicator = function deleteCompanyIndicator(_ref3) {
  var companyId = _ref3.companyId,
      indicatorId = _ref3.indicatorId;
  var fetchParams = {
    method: 'DELETE',
    url: "/api/company/".concat(companyId, "/indicator/").concat(indicatorId, "/"),
    apiId: 'api_company_indicator_delete',
    requiredParams: ['companyId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var path = "companyObjects.byId.".concat(companyId, ".indicators.").concat(indicatorId);
    var newState = state.removeInPath(path);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.deleteCompanyIndicator = deleteCompanyIndicator;