import Im from "../";

/**
 * Utilities for common operations on an Immutable object.
 * @namespace utils
 * @memberof immutable
 */

/*
 * Convert an Immutable Map to List
 * **NOTE: Deprecated now in favour of Immutable.toList() function**
 * @method
 * @memberof immutable.utils
 * @param obj
 */
export const objToList = obj => {
  if (obj == null) {
    obj = Im.Map();
  }
  return Im.List(obj.keys()).map(key => obj.get(key));
};

/**
 * Immutable sort list of objects by key. Returning new sorted immmutable list
 * @method
 * @memberof immutable.utils.functions
 * @param {array} itemList -
 * @param {string} key - The key to sort by on each item
 * @returns {}
 */
export const sortObjListByKey = (itemList, key) => {
  return itemList.sortBy((obj, index) => obj.get(key));
};

/**
 *  Set the item in state AND append to a list AND toggle a boolean when successful
 * @method
 * @memberof immutable.utils.functions
 * @param state
 * @param itemData
 * @param stateParams
 */
export const setItemInListAndVis = (state, itemData, stateParams) => {
  let { itemPath, itemListPath, formVisPath } = stateParams;
  let newState = state.setIn(itemPath.split("."), Im.fromJS(itemData));
  if (!itemData.errors && itemListPath) {
    // Create a list at the path if it is not already there
    itemListPath = itemListPath.split(".");
    newState = state.getIn(itemListPath) ? newState : newState.setIn(itemListPath, Im.List());
    // Get the list of items and append to them (if object isn't already at the end)
    const items = newState.getIn(itemListPath);
    if (!items.last() || !items.last().equals(Im.fromJS(itemData))) {
      newState = newState.updateIn(itemListPath, list => list.push(Im.fromJS(itemData)));
      newState = newState.setIn(formVisPath.split("."), false);
    }
  }
  return newState;
};

/**
 * Set the item in state AND append to a DICTIONARY AND toggle a boolean when successful
 * @method
 * @memberof immutable.utils.functions
 * @param state
 * @param itemData
 * @param stateParams
 */
export const setItemInDictAndVis = (state, itemData, stateParams) => {
  let { itemPath, itemListPath, formVisPath, keyField } = stateParams;
  let newState = state.setIn(itemPath.split("."), Im.fromJS(itemData));
  if (!itemData.errors && itemListPath) {
    // Add the item into its referenced areas (including relatedSets if applicable)
    let params = Object.assign({}, stateParams, { itemPath: itemListPath });
    newState = setListInIndexedObj(newState, itemData, params);
    // Toggle the form
    newState = newState.setIn(formVisPath.split("."), false);
  }
  return newState;
};

/**
 * Set the items from list in a DICTIONARY
 *
 * You have to be very careful of shallow and deep copying - but we don't want to
 * deep-copy the whole state - that is very inefficient.
 *
 * Therefore we check if the object
 * reference is the same and clone before editing structuring data as a DAG.
 *
 * That is why we use IMMUTABLE.js
 * @method
 * @memberof immutable.utils.functions
 * @param state
 * @param itemList
 * @param stateParams
 */
export const setListInIndexedObj = (state, itemList, stateParams) => {
  let { itemPath, keyField } = stateParams;
  itemPath = itemPath.split(".");
  // Ensure the items coming in are a list
  itemList = !Array.isArray(itemList) ? [itemList] : itemList;
  // Ensure the path exists then Merge with immutable state
  let newState = state.getIn(itemPath) ? state : state.setIn(itemPath, Im.Map());
  newState = newState.updateIn(itemPath, items => items.merge(Im.fromJS(listToObj(itemList, keyField))));
  // If there are related sets then set them here
  if (stateParams.relatedSets) {
    newState = setRelatedItems(newState, itemList, stateParams);
  }
  // Set a related key if we have one item
  if (stateParams.relatedItem && itemList.length == 1) {
    newState = newState.setIn(stateParams.relatedItem.split("."), itemList[0][keyField]);
  }
  // Set a related key if we have one item
  if (stateParams.copyTo && itemList.length == 1) {
    newState = newState.setIn(stateParams.copyTo.split("."), itemList[0]);
  }
  // Copy fields to related areas (if defined)
  if (stateParams.copyFields) {
    itemList.map(item => {
      stateParams.copyFields.forEach(copyField => {
        let { field, path } = copyField;
        let itemPath = path + "." + item[keyField] + "." + field;
        newState = newState.setIn(itemPath.split("."), Im.fromJS(item[field]));
      });
    });
  }
  return newState;
};

/**
 * Set a key into a Immutable Set O(log32 N) adds and has
 * @method
 * @memberof immutable.utils.functions
 * @param state
 * @param keyList
 * @param pathToSet
 */
export const keyListToSet = (state, keyList, pathToSet) => {
  let path = pathToSet.split(".");
  let curSet = state.getIn(path);
  let newState = state;

  // Change a List to a Set
  if (curSet && Im.List.isList(curSet)) {
    newState = newState.updateIn(path, item => Im.Set(item));
    curSet = newState.getIn(path);
  }
  // Ensure that a Set is at the path provided
  if (curSet && !Im.Set.isSet(curSet)) {
    throw new Error(`Object at path ${pathToSet} is not a Set`);
  }
  // Create a new set if nothing is there
  if (!curSet) {
    newState = state.setIn(path, Im.Set());
  }
  // Now union the set with our keys
  newState = newState.updateIn(path, item => item.union(Im.Set(keyList)));
  return newState;
};

/**
 * Add a list of items to a normalized object list with related reference(s)
 * @method
 * @memberof immutable.utils.functions
 * @param state
 * @param itemList
 * @param stateParams
 */
export const setRelatedItems = (state, itemList, stateParams) => {
  let { itemPath, keyField, relatedSets } = stateParams;

  // Convert to a list (if we have a single item only)
  itemList = !Array.isArray(itemList) ? [itemList] : itemList;
  relatedSets = !Array.isArray(relatedSets) ? [relatedSets] : relatedSets;
  let keyList = itemList.map(item => item[keyField]);
  let newState = state;
  relatedSets.forEach(path => {
    newState = keyListToSet(state, keyList, path);
  });
  return newState;
};
