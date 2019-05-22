"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFetched = void 0;

var hasFetched = function hasFetched(state, fetchParams) {
  var TIMELIM = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var method = fetchParams.method,
      url = fetchParams.url;
  var key = "".concat(method, " ").concat(url);
  var details = state.getIn(['fetch', key]);
  var now = new Date();

  if (details) {
    if (details.get('status') != 'failed') {
      var lastTimeSent = details.get('timeSent');

      if (lastTimeSent) {
        var dt = now - lastTimeSent;

        if (dt < TIMELIM) {
          return true;
        }
      }
    }
  }
};

exports.hasFetched = hasFetched;