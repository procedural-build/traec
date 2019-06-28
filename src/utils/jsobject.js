/**
 * Utility functions for manipulating deeply nested plain-Javascript objects.
 *
 * **Note that these functions have mostly been deprecated in favour of using Immutable.js.  Refer to the "immutable" namespace for further details.**
 *
 * @namespace jsobjects
 * @memberof utils
 */

/**
 * Get the value at a path in a deeply nested object.
 *
 * Can also be handled by Immutable
 * @method
 * @memberof utils.jsobjects
 * @param obj
 * @param path
 */
export const getPath = (obj, path) => {
  return path.split(".").reduce((prev, curr) => {
    return prev ? prev[curr] : undefined;
  }, obj);
};

/**
 * Set a value at a path in a deeply nested object.
 *
 * This is essentially what Immutable does - but without abstracting the data.
 *
 * It may be more efficient than using Immutables fromJS and toJS methods
 *
 * @method
 * @memberof utils.jsobjects
 * @param obj
 * @param path
 */
export const setPath = (obj, path, value, deepCopy = true) => {
  if (!path) {
    throw new Error("Must provide a path");
  }
  let newObj = deepCopy ? copyAlongPath(obj, path) : obj;
  let o = newObj;
  let k = null;
  let parts = path.split(".");
  for (let i = 0; i < parts.length; i++) {
    k = parts[i];
    if (i == parts.length - 1) {
      break;
    }
    if (!(k in o)) {
      o[k] = {};
    }
    o = o[k];
  }
  o[k] = value;
  return newObj;
};

/**
 * Returns a copy of the obj but with references along "path" deep-copied so that edits may be made on that path without
 * affecting the original object.
 *
 * Use this before "setPath" to ensure objects are deeply copied along path
 * @example
 * let newState = Object.assign({}, state)            // CAREFUL!!! Shallow copy only
 * let newState = JSON.parse(JSON.stringify(state));  // This is a deep copy - unnecessary and calc heavy for large objects
 * let newState = copyAlongPath(state, path)          // Copies state with a deep-copy along path only
 *
 * @method
 * @memberof utils.jsobjects
 * @param obj
 * @param path
 */
export const copyAlongPath = (obj, path) => {
  let newObj = Object.assign({}, obj);
  if (!path) {
    return newObj;
  }
  let n = newObj;
  let o = obj;
  let k = null;
  let parts = path.split(".");
  for (let i = 0; i < parts.length; i++) {
    k = parts[i];
    if (!(k in o) || !(typeof o[k] == "object")) {
      return newObj;
    }
    n[k] = Object.assign({}, o[k]);
    o = o[k];
    n = n[k];
  }
  return newObj;
};

/**
 *  Convert a list into an object (dictionary) with keys derived from "keyField" on each object
 * @method
 * @memberof utils.jsobjects
 * @param {array} objList - List of plain Javascript objects
 * @param {string} keyField - the field to get the value that will be used as the key in the final object
 * @returns {object} - A plain Javascript object that maps to the values in the original list by keyField
 */
export const listToObj = (objList, keyField) => {
  return objList.reduce((acc, cur) => {
    acc[cur[keyField]] = cur;
    return acc;
  }, {});
};
