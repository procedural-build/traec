"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _immutable = _interopRequireDefault(require("traec/immutable"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
"entities" database as per documentation here 
https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape

This structure should be in a format that is compatible with format output
from Normalizr
https://github.com/paularmstrong/normalizr

Reducer below is for standard operations of setting data into this database
in the "entities" namespace

General schema is:
entities: {
    object01: {
        byId: {
            ItemKey1: { Item1 }
        } 
        editingById: {
            ItemKey1 : { Item1 }
        }
    }
}
*/
var initialState = _immutable["default"].fromJS({});

function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var projectList = state.projectsById ? state.projectsById : null;

  switch (action.type) {
    case 'UI_SET_ITEM_LIST_TOGGLE':
      return (0, _utils.setItemInListAndVis)(state, action.payload, action.stateParams);

    case 'UI_SET_ITEM_DICT_TOGGLE':
      return (0, _utils.setItemInDictAndVis)(state, action.payload, action.stateParams);

    case 'UI_LIST_TO_OBJ':
      var itemList = Array.isArray(action.payload) ? action.payload : [action.payload];
      return (0, _utils.setListInIndexedObj)(state, itemList, action.stateParams);

    case 'UI_TOGGLE_BOOL':
      var formVisPath = action.stateParams.formVisPath;
      return state.setInPath(formVisPath, !state.getInPath(formVisPath));

    case 'UI_SET_IN':
      var item = action.payload;
      var itemPath = action.stateParams.itemPath;
      return state.setInPath(itemPath, _immutable["default"].fromJS(item));

    default:
      return state;
  }

  ;
}

;