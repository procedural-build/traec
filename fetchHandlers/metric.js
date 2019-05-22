"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchTreeScore = exports.postCommitScoreValues = exports.putMetricScoreValue = exports.postMetricScoreValue = exports.getMetricInputs = exports.postTrackerMetric = exports.postTreeAndMetric = exports.postTreeScore = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _tree = require("./tree");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
When we make a metric we will also create a folder for the metric 
(and any evidence/documents that might be required later).  
We will do this using Redux Thunk middleware to pass functions in
an action -> which can then dispatch more actions in itself.  This 
allows us to create Async Action Creators as discussed in the official
Redux documentation here:
https://redux.js.org/advanced/asyncactions#reducers-js
*/
var postTreeScore = function postTreeScore(_ref) {
  var trackerId = _ref.trackerId,
      refId = _ref.refId,
      commitId = _ref.commitId,
      treeId = _ref.treeId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/score/")
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      // Add this item to the trackerImpact
      var baseMetric = data.metric;
      data.metric = baseMetric.uid;
      newState = newState.addToDict('metricScores.byId', data);
      newState = newState.addToDict('baseMetrics.byId', baseMetric); // Add it to the edges of its parent tree also

      newState = newState.addListToSet("commitEdges.byId.".concat(commitId, ".trees.").concat(treeId, ".metricScores"), [data.uid]);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postTreeScore = postTreeScore;

var postTreeAndMetric = function postTreeAndMetric(_ref2) {
  var trackerId = _ref2.trackerId,
      refId = _ref2.refId,
      commitId = _ref2.commitId,
      treeId = _ref2.treeId;

  /* Handler to create a tree and then immediately create a metric if the tree returns success
  We are modifying the body before calling fetch and giving a random string to the
  tree (we will not use the tree name itself - but the metric name)
  Attach a handler to the fetchParams, so that if successful in creating a tree
  then we will immediately dispatch to create a metric on that tree.
  */
  // Create the tree fetch handler
  var _postTree = (0, _tree.postTree)({
    trackerId: trackerId,
    refId: refId,
    commitId: commitId,
    treeId: treeId
  }),
      fetchParams = _postTree.fetchParams,
      stateParams = _postTree.stateParams;

  Object.assign(fetchParams, {
    apiId: 'api_tracker_ref_tree_tree_and_metric_create'
  }); // Modify the post to give a random name for the tree

  Object.assign(fetchParams, {
    preFetchHook: function preFetchHook(body) {
      return {
        name: _crypto["default"].createHash('sha1').update(body.name).digest('hex')
      };
    },
    // Attach a nextHandler to the tree - so that the metricscore is created on successful creation of the tree
    nextHandlers: [function (data, post, orgpost) {
      var _postTreeScore = postTreeScore({
        trackerId: trackerId,
        refId: refId,
        commitId: commitId,
        treeId: data.uid
      }),
          fetchParams = _postTreeScore.fetchParams,
          stateParams = _postTreeScore.stateParams;

      Object.assign(fetchParams, {
        body: {
          metric: _objectSpread({}, orgpost)
        }
      });
      return {
        fetchParams: fetchParams,
        stateParams: stateParams
      };
    }]
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.postTreeAndMetric = postTreeAndMetric;

var postTrackerMetric = function postTrackerMetric(_ref3) {
  var trackerId = _ref3.trackerId,
      refId = _ref3.refId,
      commitId = _ref3.commitId,
      treeId = _ref3.treeId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/impact/")
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict('trackerImpact.byId', data);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postTrackerMetric = postTrackerMetric;

var getMetricInputs = function getMetricInputs(_ref4) {
  var trackerId = _ref4.trackerId,
      commitId = _ref4.commitId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/value/"),
    apiId: 'api_tracker_commit_value_list',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload; // Clear the existing values

    var newState = state.setInPath("commitEdges.byId.".concat(commitId, ".scoreValues"), {}); // Load in the new values

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        var metricScore = item.metric;
        var metricScoreId = metricScore.uid;
        var baseMetric = metricScore.metric;
        metricScore.metric = baseMetric.uid;
        item.metric = metricScore.uid;
        newState = newState.addListToDict("baseMetrics.byId", [baseMetric]);
        newState = newState.addListToDict("metricScores.byId", [item]);
        newState = newState.addListToDict("commitEdges.byId.".concat(commitId, ".scoreValues.").concat(metricScoreId, ".values"), [item]);
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

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};
/* Post a single value for a metric */


exports.getMetricInputs = getMetricInputs;

var postMetricScoreValue = function postMetricScoreValue(_ref5) {
  var trackerId = _ref5.trackerId,
      commitId = _ref5.commitId,
      scoreId = _ref5.scoreId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/score/").concat(scoreId, "/value/"),
    apiId: 'api_tracker_commit_score_value_create',
    requiredParams: ['trackerId', 'commitId', 'scoreId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams3 = action.stateParams,
        formVisPath = _action$stateParams3.formVisPath,
        formObjPath = _action$stateParams3.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("commitEdges.byId.".concat(commitId, ".scoreValues.").concat(scoreId, ".values"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};
/* Put/update single value for a metric */


exports.postMetricScoreValue = postMetricScoreValue;

var putMetricScoreValue = function putMetricScoreValue(_ref6) {
  var trackerId = _ref6.trackerId,
      commitId = _ref6.commitId,
      scoreId = _ref6.scoreId,
      inputValueId = _ref6.inputValueId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/score/").concat(scoreId, "/value/").concat(inputValueId, "/"),
    apiId: 'api_tracker_commit_score_value_update',
    requiredParams: ['trackerId', 'commitId', 'scoreId', 'inputValueId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams4 = action.stateParams,
        formVisPath = _action$stateParams4.formVisPath,
        formObjPath = _action$stateParams4.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addToDict("commitEdges.byId.".concat(commitId, ".scoreValues.").concat(scoreId, ".values"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};
/* Post multiple values for a metric */


exports.putMetricScoreValue = putMetricScoreValue;

var postCommitScoreValues = function postCommitScoreValues(_ref7) {
  var trackerId = _ref7.trackerId,
      commitId = _ref7.commitId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/commit/").concat(commitId, "/value/"),
    apiId: 'api_tracker_commit_value_create',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams5 = action.stateParams,
        formVisPath = _action$stateParams5.formVisPath,
        formObjPath = _action$stateParams5.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.addListToDict("commitEdges.byId.".concat(commitId, ".scoreValues.").concat(scoreId, ".values"), data);
      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.postCommitScoreValues = postCommitScoreValues;

var patchTreeScore = function patchTreeScore(_ref8) {
  var trackerId = _ref8.trackerId,
      refId = _ref8.refId,
      commitId = _ref8.commitId,
      treeId = _ref8.treeId,
      metricScoreId = _ref8.metricScoreId;
  var fetchParams = {
    method: 'PATCH',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/score/").concat(metricScoreId, "/"),
    apiId: 'api_tracker_ref_tree_score_partial_update',
    requiredParams: ['trackerId', 'refId', 'commitId', 'treeId', 'metricScoreId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams6 = action.stateParams,
        formVisPath = _action$stateParams6.formVisPath,
        formObjPath = _action$stateParams6.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      // Add this item to the trackerImpact
      var baseMetric = data.metric;
      data.metric = baseMetric.uid;
      newState = newState.addToDict('metricScores.byId', data);
      newState = newState.addToDict('baseMetrics.byId', baseMetric); // Add it to the edges of its parent tree also

      newState = newState.addListToSet("commitEdges.byId.".concat(commitId, ".trees.").concat(treeId, ".metricScores"), [data.uid]);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "trees.editById.".concat(treeId, ".SHOW_EDIT_SCORE_FORM"),
      formObjPath: "trees.editById.".concat(treeId, ".editMetric")
    }
  };
};

exports.patchTreeScore = patchTreeScore;