import Im from '../../immutable';
import { 
    setItemInListAndVis, 
    setItemInDictAndVis, 
    setListInIndexedObj } from '../../utils'

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

export default function(state = initialState, action) {
    const projectList = (state.projectsById) ? state.projectsById : null
    switch (action.type){
        case 'UI_SET_ITEM_LIST_TOGGLE':
            return setItemInListAndVis(state, action.payload, action.stateParams)
        case 'UI_SET_ITEM_DICT_TOGGLE':
            return setItemInDictAndVis(state, action.payload, action.stateParams)
        case 'UI_LIST_TO_OBJ':
            const itemList = Array.isArray(action.payload) ? action.payload : [action.payload]
            return setListInIndexedObj(state, itemList, action.stateParams)
        case 'UI_TOGGLE_BOOL':
            let { formVisPath } = action.stateParams
            return state.setInPath(formVisPath, !state.getInPath(formVisPath))
        case 'UI_SET_IN':
            const item = action.payload
            const { itemPath } = action.stateParams
            return state.setInPath(itemPath, Im.fromJS(item))
        default:
            return state
    };
};
