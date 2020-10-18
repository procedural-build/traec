import Im from "../../immutable";
import { setItemInListAndVis, setItemInDictAndVis, setListInIndexedObj } from "../../immutable/utils";

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

const initialState = Im.fromJS({});

/**
 * Add or Remove entities from Dictionary
 * @memberof redux.reducers
 * @param state
 * @param action
 */

const addOrRemove = (state, action) => {
  let { itemPath: path, keyField = "uid" } = action.stateParams;
  let itemPath = `${path}.${action.payload[keyField]}`;
  if (state.getInPath(itemPath)) {
    return state.removeInPath(itemPath);
  } else {
    return state.addToDict(path, action.payload, keyField);
  }
};

export default function(state = initialState, action) {
  let { payload, stateParams } = action;
  let formVisPath = stateParams ? stateParams.formVisPath : null;

  switch (action.type) {
    case "ENTITY_SET_ITEM_LIST_TOGGLE":
      return setItemInListAndVis(state, payload, stateParams);
    case "ENTITY_SET_ITEM_DICT_TOGGLE":
      return setItemInDictAndVis(state, payload, stateParams);
    case "ENTITY_LIST_TO_OBJ":
      const itemList = Array.isArray(payload) ? payload : [payload];
      return setListInIndexedObj(state, itemList, stateParams);
    case "ENTITY_ADD_TO_DICT":
      const { itemPath: path, keyField = "uid" } = stateParams;
      return state.addToDict(path, payload, keyField);
    case "ENTITY_ADD_OR_REMOVE_FROM_DICT":
      return addOrRemove(state, action);
    case "ENTITY_SET_IN":
      const item = payload;
      const { itemPath } = stateParams;
      return state.setInPath(itemPath, Im.fromJS(item));
    case "ENTITY_REMOVE_IN":
      return state.removeInPath(stateParams.itemPath);
    case "ENTITY_TOGGLE_BOOL":
      if (!formVisPath) {
        return state;
      }
      return state.setInPath(formVisPath, !state.getInPath(formVisPath));
    case "ENTITY_TOGGLE_FORM":
      if (!formVisPath) {
        return state;
      }
      return state.setInPath(formVisPath, !state.getInPath(formVisPath));
    case "ENTITY_SHOW_FORM":
      if (!formVisPath) {
        return state;
      }
      return state.setInPath(formVisPath, true);
    case "ENTITY_SET_FUNC":
      let funcName = stateParams.funcName || "stateSetFunc";
      return stateParams[funcName](state, action);
    default:
      return state;
  }
}
