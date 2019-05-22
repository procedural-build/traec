"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchConversionFactor = exports.putConversionFactor = exports.postConversionFactor = exports.getConversionFactors = void 0;

var convFactorsToState = function convFactorsToState(newState, commitId, data) {
  var baseMetrics = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      baseMetrics.push(item.metric);
      item.metric = item.metric.uid;
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

  newState = newState.addListToDict("commitEdges.byId.".concat(commitId, ".conversionFactors"), data);
  newState = newState.addListToDict("baseMetrics.byId", baseMetrics);
  return newState;
};

var getConversionFactors = function getConversionFactors(_ref) {
  var trackerId = _ref.trackerId,
      commitId = _ref.commitId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/convfactor/"),
    apiId: 'api_tracker_commit_convfactor_list',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return convFactorsToState(state, commitId, data);
  };

  var stateCheckFunc = function stateCheckFunc(state) {
    return !(state.getInPath("entities.commitEdges.byId.".concat(commitId, ".conversionFactors")) == null);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      stateCheckFunc: stateCheckFunc
    }
  };
};

exports.getConversionFactors = getConversionFactors;

var postConversionFactor = function postConversionFactor(_ref2) {
  var trackerId = _ref2.trackerId,
      commitId = _ref2.commitId,
      _ref2$from_commit_id = _ref2.from_commit_id,
      from_commit_id = _ref2$from_commit_id === void 0 ? null : _ref2$from_commit_id;
  var query_params = from_commit_id ? "?from_commit=".concat(from_commit_id) : "";
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/convfactor/").concat(query_params),
    apiId: 'api_tracker_commit_convfactor_create',
    requiredParams: ['trackerId', 'commitId'],
    queryParams: {
      from_commit_id: null
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    if (from_commit_id) {
      var _getConversionFactors = getConversionFactors(trackerId, commitId),
          stateParams = _getConversionFactors.stateParams;

      return stateParams.stateSetFunc(state, action);
    }

    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = convFactorsToState(newState, commitId, [data]);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "commitEdges.editById.".concat(commitId, ".SHOW_CONVFACT_FORM"),
      formObjPath: "commitEdges.editById.".concat(commitId, ".newConversionFactor")
    }
  };
};

exports.postConversionFactor = postConversionFactor;

var putConversionFactor = function putConversionFactor(_ref3) {
  var trackerId = _ref3.trackerId,
      commitId = _ref3.commitId,
      convFactorId = _ref3.convFactorId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/convfactor/").concat(convFactorId, "/"),
    apiId: 'api_tracker_commit_convfactor_update',
    requiredParams: ['trackerId', 'commitId', 'convFactorId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = convFactorsToState(newState, commitId, [data]);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "commitEdges.editById.".concat(commitId, ".cfs.editById.").concat(convFactorId, ".SHOW_CONVFACT_FORM"),
      formObjPath: "commitEdges.editById.".concat(commitId, ".cfs.editById.").concat(convFactorId, ".newConversionFactor")
    }
  };
};

exports.putConversionFactor = putConversionFactor;

var patchConversionFactor = function patchConversionFactor(_ref4) {
  var trackerId = _ref4.trackerId,
      commitId = _ref4.commitId,
      convFactorId = _ref4.convFactorId;

  var _putConversionFactor = putConversionFactor({
    trackerId: trackerId,
    commitId: commitId,
    convFactorId: convFactorId
  }),
      fetchParams = _putConversionFactor.fetchParams,
      stateParams = _putConversionFactor.stateParams;

  Object.assign(fetchParams, {
    method: 'PATCH'
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.patchConversionFactor = patchConversionFactor;