"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putCommitEdge = exports.getCommitEdges = void 0;

var _immutable = _interopRequireDefault(require("traec/immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getCommitEdges = function getCommitEdges(_ref) {
  var trackerId = _ref.trackerId,
      commitId = _ref.commitId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/commit/edge/").concat(commitId, "/"),
    apiId: 'api_tracker_commit_edge_read',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state; // Clear the existing commitEdges and set to null

    newState = newState.setInPath("commitEdges.byId.".concat(commitId, ".trees"), _immutable["default"].Map()); // Unpack the data into the state tree

    newState = edgeDictToState(newState, commitId, data);
    return newState;
  };

  var stateCheckFunc = function stateCheckFunc(state) {
    return !(state.getInPath("entities.commitEdges.byId.".concat(commitId, ".trees")) == null);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      stateCheckFunc: stateCheckFunc
    }
  };
};

exports.getCommitEdges = getCommitEdges;

var putCommitEdge = function putCommitEdge(_ref2) {
  var trackerId = _ref2.trackerId,
      commitId = _ref2.commitId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/commit/edge/").concat(commitId, "/"),
    apiId: 'api_tracker_commit_edge_update',
    requiredParams: ['trackerId', 'commitId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state; // Unpack the data into the state tree

    newState = edgeDictToState(newState, commitId, data);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.putCommitEdge = putCommitEdge;

var edgeDictToState = function edgeDictToState(newState, commitId, data) {
  // Unpack the data into the state tree
  for (var key in data) {
    // Get the function for storing edges
    var edgeSetFunc = edgeSetFunctions[key]; // Continue if we don't have a function to handle this edge

    if (!edgeSetFunc) {
      console.log("Skipping handling of edge type: ".concat(key));
      continue;
    } // Add them to the store


    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var edge = _step.value;
        newState = edgeSetFunc(commitId, edge, newState);
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
  }

  return newState;
};

var edgeSetFunctions = {
  treetree: function treetree(commitId, edge, newState) {
    var parent = edge.parent,
        child = edge.child;
    newState = newState.addToDict('trees.byId', child);

    if (parent) {
      newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".trees.").concat(parent.uid, ".trees")], [child.uid]);
      newState = newState.setInPath("commitEdges.byId.".concat(commitId, ".trees.").concat(child.uid, ".parent"), parent.uid);
    }

    return newState;
  },
  treedocument: function treedocument(commitId, edge, newState) {
    var tree = edge.tree,
        document = edge.document;
    newState = newState.addToDict('documents.byId', document);
    newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".trees.").concat(tree.uid, ".documents")], [document.uid]);
    return newState;
  },
  treecategory: function treecategory(commitId, edge, newState) {
    var tree = edge.tree,
        branchId = edge.branchId;
    newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".trees.").concat(tree.uid, ".categories")], [branchId]);
    return newState;
  },
  treescore: function treescore(commitId, edge, newState) {
    var tree = edge.tree,
        score = edge.score;
    var baseMetric = score.metric;
    score.metric = baseMetric.uid;
    newState = newState.addToDict('metricScores.byId', score);
    newState = newState.addToDict('baseMetrics.byId', baseMetric);
    newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".trees.").concat(tree.uid, ".metricScores")], [score.uid]);
    return newState;
  },
  treedescription: function treedescription(commitId, edge, newState) {
    var tree = edge.tree,
        description = edge.description;
    newState = newState.addToDict('descriptions.byId', description);
    newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".trees.").concat(tree.uid, ".descriptions")], [description.uid]);
    return newState;
  },
  documentdescription: function documentdescription(commitId, edge, newState) {
    var document = edge.document,
        description = edge.description;
    newState = newState.addToDict('descriptions.byId', description);
    newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".documents.").concat(document.uid, ".descriptions")], [description.uid]);
    return newState;
  },
  documentstatus: function documentstatus(commitId, edge, newState) {
    var document = edge.document,
        status = edge.status; // Store the nested current_object separately and refer to only uuid in status

    if (status.current_object) {
      newState = newState.addToDict('docObjects.byId', status.current_object);
      status.current_object = status.current_object.uid;
    } // Store status and link to commitEdge 


    newState = newState.addToDict('docStatuses.byId', status);
    newState = newState.setInPath("commitEdges.byId.".concat(commitId, ".documents.").concat(document.uid, ".status"), status.uid);
    return newState;
  },
  documentscore: function documentscore(commitId, edge, newState) {
    var document = edge.document,
        score = edge.score;
    newState = newState.addToDict('score.byId', score);
    newState = newState.addListToSets(["commitEdges.byId.".concat(commitId, ".documents.").concat(document.uid, ".scores")], [score.uid]);
    return newState;
  }
};