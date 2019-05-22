"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reduxImmutable = require("redux-immutable");

var _immutable = _interopRequireDefault(require("traec/immutable"));

var _entities = _interopRequireDefault(require("./entities"));

var _reducers = _interopRequireDefault(require("../auth/_redux/reducers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import { combineReducers } from 'redux';

/* 
Class for accessing the root namespace of the state.  We should not need
this as we can use the "entities" namespace as the root for most objects

Refer to: 
http://blog.jakoblind.no/code-your-own-combinereducers/ 
https://medium.com/front-end-hacking/using-immutable-js-with-redux-ba89025e45e2
*/
var initialState = _immutable["default"].fromJS({
  test: false
});

var rootNamespaceReducer = function rootNamespaceReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    default:
      console.log("CALLING ROOT REDUCER!!");
      return Object.assign({}, state, {
        test: true,
        auth: {
          test: true
        }
      });
  }

  ;
};

var domainReducers = (0, _reduxImmutable.combineReducers)({
  entities: _entities["default"],
  auth: _reducers["default"],
  projects: projects,
  project: project
});

var combineReducersWithRoot = function combineReducersWithRoot() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var nextState = {}; // Apply the root namespace reducer

  Object.assign(nextState, rootNamespaceReducer(state, action)); // Apply the domain reducers

  Object.assign(nextState, domainReducers(state, action));
  return nextState;
}; //export default combineReducersWithRoot


var _default = combineReducersWithRoot;
exports["default"] = _default;