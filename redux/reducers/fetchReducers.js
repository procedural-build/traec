"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _immutable = _interopRequireDefault(require("traec/immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Milliseconds to warn if the response is longer than this
var WARNTIME = 1500;

var initialState = _immutable["default"].fromJS({});

var get_key = function get_key(action) {
  var _action$fetchParams = action.fetchParams,
      method = _action$fetchParams.method,
      url = _action$fetchParams.url;
  return "".concat(method, " ").concat(url);
};

var checkResponseTime = function checkResponseTime(timeSent, now, action) {
  if (timeSent) {
    var dt = now - timeSent;

    if (dt > WARNTIME) {
      console.warn("FETCH TIME ".concat(dt, "ms EXCEEDED LIMIT"), action);
    }
  } //console.warn("NO timSent FOUND FOR FETCH RESPONSE", action)

};

function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var key = null;
  var details = null;
  var now = null;

  switch (action.type) {
    case 'FETCH_SET_SENT':
      key = get_key(action); // See if there is already an object in state

      details = state.get(key) || _immutable["default"].fromJS({
        timeSent: new Date(),
        timeRecv: null,
        status: 'sent',
        refreshRequired: false,
        retries: 0,
        failures: 0
      }); // If the last call was a failure then increment the retries counter

      if (details.get('status') == 'failure') {
        details = details.update('retries', 0, function (value) {
          return value + 1;
        });
      } // Set the status to sent


      if (details.get('status') != 'sent') {
        details = details.set('status', 'sent');
        details = details.set('timeSent', new Date());
      }

      return state.set(key, details);

    case 'FETCH_SUCCESS':
      key = get_key(action);
      now = new Date();
      checkResponseTime(state.getIn([key, 'timeSent']), now, action); // print a little warning of the 

      return state.mergeIn([key], _immutable["default"].fromJS({
        status: 'success',
        timeRecv: now,
        failures: 0,
        retries: 0
      }));

    case 'FETCH_FAIL':
      key = get_key(action);
      now = new Date();
      checkResponseTime(state.getIn([key, 'timeSent']), now, action);
      details = state.get(key);
      return state.mergeIn([key], _immutable["default"].fromJS({
        status: 'failed',
        timeRecv: now,
        failures: details.get('failures', 0) + 1
      }));

    default:
      return state;
  }

  ;
}

;