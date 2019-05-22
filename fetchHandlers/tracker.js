"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchTracker = exports.putTracker = exports.postTracker = exports.getTrackers = exports.getTrackerList = exports.getTracker = void 0;

var addTrackerToState = function addTrackerToState(state, data) {
  // Cut out the root_master ref data
  var refData = data.root_master;
  data.root_master = refData.uid; // Get the alternative root masters out

  var altRootMasters = data.alt_root_masters;
  var branchRefMap = {};

  if (altRootMasters) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data.alt_root_masters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        branchRefMap[item.latest_commit.root_commit] = item.uid;
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

    data.alt_root_masters = branchRefMap;
  } // Add the tracker and ref to dict


  var newState = state.addToDict('trackers.byId', data);
  newState = newState.addToDict('refs.byId', refData);

  if (altRootMasters) {
    newState = newState.addListToDict('refs.byId', altRootMasters);
  }

  return newState;
};

var getTracker = function getTracker(_ref) {
  var trackerId = _ref.trackerId;
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(trackerId, "/"),
    apiId: 'api_tracker_read'
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    return addTrackerToState(state, action.payload);
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getTracker = getTracker;

var getTrackerList = function getTrackerList(_ref2) {
  var _ref2$onlyTemplates = _ref2.onlyTemplates,
      onlyTemplates = _ref2$onlyTemplates === void 0 ? false : _ref2$onlyTemplates;
  var query_params = onlyTemplates ? '?onlyTemplates=true' : '';
  var fetchParams = {
    method: 'GET',
    url: "/api/tracker/".concat(query_params),
    apiId: 'api_tracker_list',
    queryParams: {
      onlyTemplates: false
    }
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;
        newState = addTrackerToState(newState, item);
        newState = newState.setInPath("fetchFlags.trackers.".concat(query_params), true);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return newState;
  };

  var stateCheckFunc = function stateCheckFunc(state) {
    return state.getInPath("entities.fetchFlags.trackers.".concat(query_params));
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      stateCheckFunc: stateCheckFunc
    }
  };
};

exports.getTrackerList = getTrackerList;

var getTrackers = function getTrackers(_ref3) {
  var projectId = _ref3.projectId;
  var fetchParams = {
    method: 'GET',
    url: "/api/project/".concat(projectId, "/tracker/"),
    apiId: 'api_project_tracker_list',
    requiredParams: ['projectId'],
    queryParams: []
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var newState = state;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var item = _step3.value;
        newState = addTrackerToState(newState, item);
      } // Add the uids of the trackers to the project

    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var trackerIds = data.map(function (item) {
      return {
        uid: item.uid,
        name: item.name
      };
    });
    newState = newState.addListToSets(["projects.byId.".concat(projectId, ".trackers")], trackerIds);
    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.getTrackers = getTrackers;

var postTracker = function postTracker(_ref4) {
  var projectId = _ref4.projectId;
  var fetchParams = {
    method: 'POST',
    url: "/api/project/".concat(projectId, "/tracker/"),
    apiId: 'api_tracker_create'
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload; // Not used if we add a tracker via a button (or async call)

    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.setInPath(formVisPath, false);
      newState = addTrackerToState(newState, data); //newState = newState.addListToSets( [`projects.byId.${projectId}.trackers`],  [{ uid: data.uid, name: data.name }])
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

exports.postTracker = postTracker;

var putTracker = function putTracker(_ref5) {
  var trackerId = _ref5.trackerId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/"),
    apiId: 'api_tracker_update'
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload; // Not used if we add a tracker via a button (or async call)

    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      newState = newState.setInPath(formVisPath, false);
      newState = addTrackerToState(newState, data);
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

exports.putTracker = putTracker;

var patchTracker = function patchTracker(_ref6) {
  var trackerId = _ref6.trackerId;

  var _putTracker = putTracker({
    trackerId: trackerId
  }),
      fetchParams = _putTracker.fetchParams,
      stateParams = _putTracker.stateParams;

  Object.assign(fetchParams, {
    method: 'PATCH'
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.patchTracker = patchTracker;