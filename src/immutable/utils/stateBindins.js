import Im from "../index";
import { listToObj } from "../../utils";

/**
 * Utilities for manipulating an Immutable object (or state) en-masse
 *
 * **These functions are defined so as to be monkey-patched onto the Immutable.Map.prototype.**
 *
 * @namespace bindings
 * @memberof immutable.utils
 * @example
 * const state = Traec.Im.fromJS(plainjsobject)
 * // Using state set (passing immutable object as first argument)
 * getInPath(state, 'some.deep.path.in.dot.notation')
 * // Using bindings that are monkey-patched onto Immutable at app initialization
 * state.getInPath('some.deep.path.in.dot.notation')
 */

/**
 * Set a list of items into a Immutable Set O(log32 N)
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the set as a string in dot-notation
 * @param {array} keyList - Array of objects (generally ID-keys) that will be added to the set
 */
export const addListToSet = function(path, keyList) {
  path = path.split(".");
  let curSet = this.getIn(path);
  let newState = this;
  // Change a List to a Set
  if (curSet && Im.List.isList(curSet)) {
    newState = newState.updateIn(path, item => Im.Set(item));
    curSet = newState.getIn(path);
  }
  // Ensure that a Set is at the path provided
  if (curSet && !Im.Set.isSet(curSet)) {
    throw new Error(`Object at path ${path} is not a Set`);
  }
  // Create a new set if nothing is there
  if (!curSet) {
    newState = newState.setIn(path, Im.Set());
  }
  // Now union the set with our keys
  let keyListIm = Im.fromJS(keyList);
  return newState.updateIn(path, item => item.union(Im.Set(keyListIm)));
};

/**
 * Set a list of items into multiple sets a Immutable Set O(log32 N)
 * @method
 * @memberof immutable.utils.bindings
 * @param {array} paths - Array of paths to the sets where object will be added as strings in dot-notation
 * @param {array} keyList - Array of objects (generally ID-keys) that will be added to the set
 */
export const addListToSets = function(paths, keyList) {
  let newState = this;
  paths.map(path => {
    newState = newState.addListToSet(path, keyList);
  });
  return newState;
};

/**
 * Set an item within the Immutable object at a location defined using dot-notation string reference *
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 * @param {object} data - Object to be added at the path (plain JS objects will be converted to Immutable)
 */
export const setInPath = function(path, data) {
  if (!path) {
    return this;
  }
  return this.setIn(path.split("."), Im.fromJS(data));
};

/**
 * Get an item from the Immutable object using dot-notation string reference
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 */
export const getInPath = function(path) {
  return this.getIn(path.split("."));
};

/**
 * Remove an item from the Immutable object the location defined using dot-notation string reference
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 */
export const removeInPath = function(path) {
  return this.removeIn(path.split("."));
};

/**
 * Shallow-merge an object with the data at location defined using dot-notation string reference
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 */
export const mergeInPath = function(path, data) {
  return this.mergeIn(path.split("."), Im.fromJS(data));
};

/**
 * Deep-merge an object with the data at location defined using dot-notation string reference
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 */
export const mergeDeepInPath = function(path, data) {
  return this.mergeDeepIn(path.split("."), Im.fromJS(data));
};

/**
 * Add an object to a List nested within an Immutable object at the path specified by dot-notation string.
 * A deep comparison will be made between the **last** item in the list to add and the new incoming item.
 * If they are the same then the new item will not be added.
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 * @param {string} data - The object to append to the list.  Plain JS objects will be converted to Immutable.
 */
export const addToList = function(path, data) {
  // Create a list at the path if it is not already there
  path = path.split(".");
  let newState = this.getIn(path) ? this : this.setIn(path, Im.List());
  // Check if the item exists at the end of the list already
  if (!items.last() || !items.last().equals(Im.fromJS(itemData))) {
    newState = newState.updateIn(path, list => list.push(Im.fromJS(data)));
  }
  return newState;
};

/**
 * Add an object to an existing "map" (ie. dictionary) at the path specified using dot-notation string.
 *
 * In order to add the object to the map a value to use for the key is required.  This is by default taken
 * to be the field "uid" that is expected to exist in the data.  However you may provide an alternative
 * "keyField" parameter that will use that field value from data as the key-value in the map
 *
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 * @param {object} data - The object to store.  Plain-JS objects will be convered to Immutable.
 * @param {string} [keyField="uid"] - The field from within "data" that will be used to make the key in the dictionary
 */
export const addToDict = function(path, data, keyField = "uid") {
  return this.addListToDict(path, data, keyField);
};

/**
 * Add multiple objects to an existing "map" (ie. dictionary) at the path specified using dot-notation string.
 *
 * In order to add each object to the map a value to use for the key is required.  This is by default taken
 * to be the field "uid" that is expected to exist in the data.  However you may provide an alternative
 * "keyField" parameter that will use that field value from data as the key-value in the map
 *
 * @method
 * @memberof immutable.utils.bindings
 * @param {string} path - Path to the location as a string in dot-notation
 * @param {array} dataList - The array of objects to store.  Plain-JS objects will be convered to Immutable.
 * @param {string} [keyField="uid"] - The field from within each "data" object that will be used to make the key in the dictionary
 */
export const addListToDict = function(path, dataList, keyField = "uid") {
  path = path.split(".");
  dataList = !Array.isArray(dataList) ? [dataList] : dataList;
  // Ensure that the path exists
  let newState = this.getIn(path) ? this : this.setIn(path, Im.Map());
  // Add the new list of item to the dictionary with key from keyField
  newState = newState.updateIn(path, items => items.mergeDeep(Im.fromJS(listToObj(dataList, keyField))));
  return newState;
};
