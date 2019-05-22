"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListToDict = exports.addToDict = exports.addToList = exports.removeInPath = exports.getInPath = exports.setInPath = exports.addListToSets = exports.addListToSet = void 0;

var _index = _interopRequireDefault(require("../index"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
UTILITIES FOR MANIPULATING AN IMMUTABLE STATE OBJECT EN-MASSE.

These functions are defined to be monkey-patched onto the
Immutable.Map.prototype.
*/
// Set a list of items into a Immutable Set O(log32 N)
var addListToSet = function addListToSet(path, keyList) {
  path = path.split('.');
  var curSet = this.getIn(path);
  var newState = this; // Change a List to a Set

  if (curSet && _index["default"].List.isList(curSet)) {
    newState = newState.updateIn(path, function (item) {
      return _index["default"].Set(item);
    });
    curSet = newState.getIn(path);
  } // Ensure that a Set is at the path provided


  if (curSet && !_index["default"].Set.isSet(curSet)) {
    throw new Error("Object at path ".concat(path, " is not a Set"));
  } // Create a new set if nothing is there


  if (!curSet) {
    newState = newState.setIn(path, _index["default"].Set());
  } // Now union the set with our keys


  var keyListIm = _index["default"].fromJS(keyList);

  return newState.updateIn(path, function (item) {
    return item.union(_index["default"].Set(keyListIm));
  });
};

exports.addListToSet = addListToSet;

var addListToSets = function addListToSets(paths, keyList) {
  var newState = this;
  paths.map(function (path) {
    newState = newState.addListToSet(path, keyList);
  });
  return newState;
};

exports.addListToSets = addListToSets;

var setInPath = function setInPath(path, data) {
  if (!path) {
    return this;
  }

  return this.setIn(path.split('.'), _index["default"].fromJS(data));
};

exports.setInPath = setInPath;

var getInPath = function getInPath(path) {
  return this.getIn(path.split('.'));
};

exports.getInPath = getInPath;

var removeInPath = function removeInPath(path) {
  return this.removeIn(path.split('.'));
};

exports.removeInPath = removeInPath;

var addToList = function addToList(path, data) {
  // Create a list at the path if it is not already there
  path = path.split('.');
  var newState = this.getIn(path) ? this : this.setIn(path, _index["default"].List()); // Check if the item exists at the end of the list already

  if (!items.last() || !items.last().equals(_index["default"].fromJS(itemData))) {
    newState = newState.updateIn(path, function (list) {
      return list.push(_index["default"].fromJS(data));
    });
  }

  return newState;
};

exports.addToList = addToList;

var addToDict = function addToDict(path, data) {
  var keyField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "uid";
  return this.addListToDict(path, data, keyField);
};

exports.addToDict = addToDict;

var addListToDict = function addListToDict(path, dataList) {
  var keyField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "uid";
  path = path.split('.');
  dataList = !Array.isArray(dataList) ? [dataList] : dataList; // Ensure that the path exists

  var newState = this.getIn(path) ? this : this.setIn(path, _index["default"].Map()); // Add the new list of item to the dictionary with key from keyField

  newState = newState.updateIn(path, function (items) {
    return items.merge(_index["default"].fromJS((0, _utils.listToObj)(dataList, keyField)));
  });
  return newState;
};

exports.addListToDict = addListToDict;