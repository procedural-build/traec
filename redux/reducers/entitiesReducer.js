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

var addOrRemove = function addOrRemove(state, action) {
  var _action$stateParams = action.stateParams,
      path = _action$stateParams.itemPath,
      _action$stateParams$k = _action$stateParams.keyField,
      keyField = _action$stateParams$k === void 0 ? "uid" : _action$stateParams$k;
  var itemPath = "".concat(path, ".").concat(action.payload[keyField]);

  if (state.getInPath(itemPath)) {
    return state.removeInPath(itemPath);
  } else {
    return state.addToDict(path, action.payload, keyField);
  }
};

function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ENTITY_SET_ITEM_LIST_TOGGLE':
      return (0, _utils.setItemInListAndVis)(state, action.payload, action.stateParams);

    case 'ENTITY_SET_ITEM_DICT_TOGGLE':
      return (0, _utils.setItemInDictAndVis)(state, action.payload, action.stateParams);

    case 'ENTITY_LIST_TO_OBJ':
      var itemList = Array.isArray(action.payload) ? action.payload : [action.payload];
      return (0, _utils.setListInIndexedObj)(state, itemList, action.stateParams);

    case 'ENTITY_ADD_TO_DICT':
      var _action$stateParams2 = action.stateParams,
          path = _action$stateParams2.itemPath,
          _action$stateParams2$ = _action$stateParams2.keyField,
          keyField = _action$stateParams2$ === void 0 ? "uid" : _action$stateParams2$;
      return state.addToDict(path, action.payload, keyField);

    case 'ENTITY_ADD_OR_REMOVE_FROM_DICT':
      return addOrRemove(state, action);

    case 'ENTITY_SET_IN':
      var item = action.payload;
      var itemPath = action.stateParams.itemPath;
      return state.setInPath(itemPath, _immutable["default"].fromJS(item));

    case 'ENTITY_REMOVE_IN':
      return state.removeInPath(action.stateParams.itemPath);

    case 'ENTITY_TOGGLE_BOOL':
      var formVisPath = action.stateParams.formVisPath;

      if (!formVisPath) {
        return state;
      }

      return state.setInPath(formVisPath, !state.getInPath(formVisPath));

    case 'ENTITY_SET_FUNC':
      var funcName = action.stateParams.funcName || "stateSetFunc";
      return action.stateParams[funcName](state, action);

    default:
      return state;
  }

  ;
}

;