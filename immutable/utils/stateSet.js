import Im from '../index';
import { listToObj } from '../../utils';

/*
UTILITIES FOR MANIPULATING AN IMMUTABLE STATE OBJECT EN-MASSE
*/

// Set a list of items into a Immutable Set O(log32 N)
export const addListToSet = (state, path, keyList) => {
    path = path.split('.')
    let curSet = state.getIn(path)
    let newState = state
    // Change a List to a Set
    if (curSet && Im.List.isList(curSet)) {
        newState = newState.updateIn(path, item => Im.Set(item))
        curSet = newState.getIn(path)
    }
    // Ensure that a Set is at the path provided
    if (curSet && !Im.Set.isSet(curSet)) {
        throw new Error(`Object at path ${path} is not a Set`)
    }
    // Create a new set if nothing is there
    if (!curSet) {
        newState = state.setIn(path, Im.Set())
    }
    // Now union the set with our keys
    let keyListIm = Im.fromJS(keyList)
    return newState.updateIn(path, item => item.union(Im.Set(keyListIm)))
}

export const addListToSets = (state, paths, keyList) => {
    let newState = state
    paths.map( path => {
        newState = addListToSet(newState, path, keyList)
    })
    return newState
}

export const setInPath = (state, path, data) => {
    if (!path) { return state } 
    return state.setIn(path.split('.'), Im.fromJS(data))
}

export const getInPath = (state, path) => {
    return state.getIn(path.split('.'))
}

export const removeIn = (state, path) => {
    return state.removeIn(path.split('.'))
}

export const addToList = (state, path, data) => {
    // Create a list at the path if it is not already there
    path = path.split('.')
    let newState = (state.getIn(path)) ? state : state.setIn(path, Im.List())
    // Check if the item exists at the end of the list already
    if (!items.last() || !(items.last().equals(Im.fromJS(itemData)))) {
        newState = newState.updateIn( path, list => list.push(Im.fromJS(data)) );
    }
    return newState
}


export const addToDict = (state, path, data, keyField="uid") => {
    return addListToDict(state, path, data, keyField);
}


export const addListToDict = (state, path, dataList, keyField="uid") => {
    path = path.split('.')
    dataList = (!Array.isArray(dataList)) ? [dataList] : dataList
    // Ensure that the path exists
    let newState = (state.getIn(path)) ? state : state.setIn(path, Im.Map())
    // Add the new list of item to the dictionary with key from keyField
    newState = newState.updateIn(path,
        items => items.merge( Im.fromJS(listToObj( dataList, keyField )) )
    ) 
    return newState
}
