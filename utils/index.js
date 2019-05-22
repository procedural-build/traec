"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRelatedItems = exports.keyListToSet = exports.setListInIndexedObj = exports.setItemInDictAndVis = exports.setItemInListAndVis = exports.sortObjListByKey = exports.listToObj = exports.objToList = exports.copyAlongPath = exports.setPath = exports.getPath = exports.camelCaseToSentence = void 0;

var _immutable = _interopRequireDefault(require("traec/immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Convert camelCase to Sentence Case
var camelCaseToSentence = function camelCaseToSentence(text) {
  var result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}; // Get the value at a path in a deeply nested object
// Can also be handled by Immutable 


exports.camelCaseToSentence = camelCaseToSentence;

var getPath = function getPath(obj, path) {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj);
}; // Set a value at a path in a deeply nested object
// This is essentially what Immutable does - but without abstracting the 
// data - so it may be more efficient than using Immutables fromJS and toJS methods


exports.getPath = getPath;

var setPath = function setPath(obj, path, value) {
  var deepCopy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  if (!path) {
    throw new Error('Must provide a path');
  }

  var newObj = deepCopy ? copyAlongPath(obj, path) : obj;
  var o = newObj;
  var k = null;
  var parts = path.split('.');

  for (var i = 0; i < parts.length; i++) {
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
}; // Returns a copy of the obj but with references along "path" deep-copied
// so that edits may be made on that path without affecting the original object
// Use this before "setPath" to ensure objects are deeply copied along path
// ie let newState = Object.assign({}, state)            // CAREFUL!!! Shallow copy only
//    let newState = JSON.parse(JSON.stringify(state));  // This is a deep copy - unnecessary and calc heavy for large objecst
//    let newState = copyAlongPath(state, path)          // Copes state with a deep-copy along path only


exports.setPath = setPath;

var copyAlongPath = function copyAlongPath(obj, path) {
  var newObj = Object.assign({}, obj);

  if (!path) {
    return newObj;
  }

  var n = newObj;
  var o = obj;
  var k = null;
  var parts = path.split('.');

  for (var i = 0; i < parts.length; i++) {
    k = parts[i];

    if (!(k in o) || !(_typeof(o[k]) == 'object')) {
      return newObj;
    }

    n[k] = Object.assign({}, o[k]);
    o = o[k];
    n = n[k];
  }

  return newObj;
}; // When storing data as an indexed object (dictionary) then use this method to get the
// Dictionary back as a list for rendering
// https://techblog.appnexus.com/five-tips-for-working-with-redux-in-large-applications-89452af4fdcb
// MODIFIED FOR IMMUTABLE OBJECTS


exports.copyAlongPath = copyAlongPath;

var objToList = function objToList(obj) {
  if (obj == null) {
    obj = _immutable["default"].Map();
  }

  return _immutable["default"].List(obj.keys()).map(function (key) {
    return obj.get(key);
  });
}; // Convert a list into an indexed object (dictionary) using key-values from each object


exports.objToList = objToList;

var listToObj = function listToObj(objList, keyField) {
  return objList.reduce(function (acc, cur) {
    acc[cur[keyField]] = cur;
    return acc;
  }, {});
}; // Immutable sort on list of objects by key


exports.listToObj = listToObj;

var sortObjListByKey = function sortObjListByKey(itemList, key) {
  return itemList.sortBy(function (obj, index) {
    return obj.get(key);
  });
}; // Set the item in state AND append to a list AND toggle a boolean when successful


exports.sortObjListByKey = sortObjListByKey;

var setItemInListAndVis = function setItemInListAndVis(state, itemData, stateParams) {
  var itemPath = stateParams.itemPath,
      itemListPath = stateParams.itemListPath,
      formVisPath = stateParams.formVisPath;
  var newState = state.setIn(itemPath.split('.'), _immutable["default"].fromJS(itemData));

  if (!itemData.errors && itemListPath) {
    // Create a list at the path if it is not already there
    itemListPath = itemListPath.split('.');
    newState = state.getIn(itemListPath) ? newState : newState.setIn(itemListPath, _immutable["default"].List()); // Get the list of items and append to them (if object isn't already at the end)

    var items = newState.getIn(itemListPath);

    if (!items.last() || !items.last().equals(_immutable["default"].fromJS(itemData))) {
      newState = newState.updateIn(itemListPath, function (list) {
        return list.push(_immutable["default"].fromJS(itemData));
      });
      newState = newState.setIn(formVisPath.split('.'), false);
    }
  }

  return newState;
}; // Set the item in state AND append to a DICTIONARY AND toggle a boolean when successful


exports.setItemInListAndVis = setItemInListAndVis;

var setItemInDictAndVis = function setItemInDictAndVis(state, itemData, stateParams) {
  var itemPath = stateParams.itemPath,
      itemListPath = stateParams.itemListPath,
      formVisPath = stateParams.formVisPath,
      keyField = stateParams.keyField;
  var newState = state.setIn(itemPath.split('.'), _immutable["default"].fromJS(itemData));

  if (!itemData.errors && itemListPath) {
    // Add the item into its referenced areas (including relatedSets if applicable)
    var params = Object.assign({}, stateParams, {
      itemPath: itemListPath
    });
    newState = setListInIndexedObj(newState, itemData, params); // Toggle the form

    newState = newState.setIn(formVisPath.split('.'), false);
  }

  return newState;
}; // Set the items from list in a DICTIONARY
// You have to be very careful of shallow and deep copying - but we don't want to 
// deep-copy the whole state - that is very inefficient.  So we check if the object
// reference is the same and clone before editing structuring data as a DAG
// That is why we use IMMUTABLE.js


exports.setItemInDictAndVis = setItemInDictAndVis;

var setListInIndexedObj = function setListInIndexedObj(state, itemList, stateParams) {
  var itemPath = stateParams.itemPath,
      keyField = stateParams.keyField;
  itemPath = itemPath.split('.'); // Ensure the items coming in are a list

  itemList = !Array.isArray(itemList) ? [itemList] : itemList; // Ensure the path exists then Merge with immutable state

  var newState = state.getIn(itemPath) ? state : state.setIn(itemPath, _immutable["default"].Map());
  newState = newState.updateIn(itemPath, function (items) {
    return items.merge(_immutable["default"].fromJS(listToObj(itemList, keyField)));
  }); // If there are related sets then set them here

  if (stateParams.relatedSets) {
    newState = setRelatedItems(newState, itemList, stateParams);
  } // Set a related key if we have one item


  if (stateParams.relatedItem && itemList.length == 1) {
    newState = newState.setIn(stateParams.relatedItem.split('.'), itemList[0][keyField]);
  } // Set a related key if we have one item


  if (stateParams.copyTo && itemList.length == 1) {
    newState = newState.setIn(stateParams.copyTo.split('.'), itemList[0]);
  } // Copy fields to related areas (if defined)


  if (stateParams.copyFields) {
    itemList.map(function (item) {
      stateParams.copyFields.forEach(function (copyField) {
        var field = copyField.field,
            path = copyField.path;
        var itemPath = path + "." + item[keyField] + "." + field;
        newState = newState.setIn(itemPath.split('.'), _immutable["default"].fromJS(item[field]));
      });
    });
  }

  return newState;
}; // Set a key into a Immutable Set O(log32 N) adds and has


exports.setListInIndexedObj = setListInIndexedObj;

var keyListToSet = function keyListToSet(state, keyList, pathToSet) {
  var path = pathToSet.split('.');
  var curSet = state.getIn(path);
  var newState = state; // Change a List to a Set

  if (curSet && _immutable["default"].List.isList(curSet)) {
    newState = newState.updateIn(path, function (item) {
      return _immutable["default"].Set(item);
    });
    curSet = newState.getIn(path);
  } // Ensure that a Set is at the path provided


  if (curSet && !_immutable["default"].Set.isSet(curSet)) {
    throw new Error("Object at path ".concat(pathToSet, " is not a Set"));
  } // Create a new set if nothing is there


  if (!curSet) {
    newState = state.setIn(path, _immutable["default"].Set());
  } // Now union the set with our keys


  newState = newState.updateIn(path, function (item) {
    return item.union(_immutable["default"].Set(keyList));
  });
  return newState;
}; // Add a list of items to a normalized object list with related reference(s)


exports.keyListToSet = keyListToSet;

var setRelatedItems = function setRelatedItems(state, itemList, stateParams) {
  var itemPath = stateParams.itemPath,
      keyField = stateParams.keyField,
      relatedSets = stateParams.relatedSets; // Convert to a list (if we have a single item only)

  itemList = !Array.isArray(itemList) ? [itemList] : itemList;
  relatedSets = !Array.isArray(relatedSets) ? [relatedSets] : relatedSets;
  var keyList = itemList.map(function (item) {
    return item[keyField];
  });
  var newState = state;
  relatedSets.forEach(function (path) {
    newState = keyListToSet(state, keyList, path);
  });
  return newState;
};

exports.setRelatedItems = setRelatedItems;