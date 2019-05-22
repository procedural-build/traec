"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putHead = void 0;

var putHead = function putHead(_ref) {
  var trackerId = _ref.trackerId,
      refId = _ref.refId,
      branchId = _ref.branchId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/head/").concat(branchId, "/"),
    apiId: 'api_tracker_ref_head_update'
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    return state;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.putHead = putHead;