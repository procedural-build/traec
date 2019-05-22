"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports["default"] = void 0;

var fetchHandlers = _interopRequireWildcard(require("./fetchHandlers"));

var fetchBindings = _interopRequireWildcard(require("./fetchBindings"));

var _handlerMap = require("./handlerMap");

Object.keys(_handlerMap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _handlerMap[key];
    }
  });
});

var _utils = require("./fetchBindings/utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _fetchManager = _interopRequireDefault(require("./fetchManager"));

var _immutable = _interopRequireDefault(require("./immutable"));

var _redux = _interopRequireDefault(require("./redux"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var _default = {
  fetchHandlers: fetchHandlers,
  fetchBindings: fetchBindings,
  handlerMap: _handlerMap.handlerMap,
  fetchRequired: _utils.fetchRequired,
  Fetch: _fetchManager["default"],
  Im: _immutable["default"],
  Redux: _redux["default"]
};
exports["default"] = _default;

exports.printMsg = function () {
  console.log("This is a message from the demo package");
};