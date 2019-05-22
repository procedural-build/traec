"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reduxImmutable = require("redux-immutable");

var _immutable = _interopRequireDefault(require("traec/immutable"));

var _uiReducer = _interopRequireDefault(require("./uiReducer"));

var _entitiesReducer = _interopRequireDefault(require("./entitiesReducer"));

var _reducers = _interopRequireDefault(require("./reducers"));

var _fetchReducers = _interopRequireDefault(require("./fetchReducers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import { combineReducers } from 'redux';
var appReducer = (0, _reduxImmutable.combineReducers)({
  ui: _uiReducer["default"],
  entities: _entitiesReducer["default"],
  auth: _reducers["default"],
  fetch: _fetchReducers["default"]
});

var rootReducer = function rootReducer(state, action) {
  if (action.type === 'USER_LOGOUT') {
    state = _immutable["default"].fromJS({});
  }

  return appReducer(state, action);
};

var _default = rootReducer;
exports["default"] = _default;