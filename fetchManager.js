"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _actionCreators = require("./redux/actionCreators");

var _handlerMap = require("./handlerMap");

var _fetchCache = require("./redux/fetchCache");

var _store = _interopRequireDefault(require("./redux/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
This is a wrapper around the fetchHandlers which manages the setting, getting 
and dispatching of the fetchHandler methods.  So instead of calling fetchHandlers
from within a connected React component like this:
let params = handlerMap[apiId][httpMethod]
this.props.dispatch(fetchToState(params))

You can use the wrapper to call it like this:
Traec.Fetch(apiId, httpMethod).dispatch()

*/
var Fetch =
/*#__PURE__*/
function () {
  function Fetch(apiId, method, params) {
    var overrides = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Fetch);

    /* HOOKS 
    Override these to do something prior to dispatch
    (ie. validate action.fetchParms.body or display a notification)*/
    this.preDispatchHook = function (action) {
      return action;
    };

    this.preUpdateHook = function (args) {
      return args;
    }; // Properties of this can be overrided on instantiation


    for (var _i = 0, _Object$keys = Object.keys(overrides); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      this[key] = overrides[key];
    } // Store the original apiId and method calls


    this._apiId = apiId;
    this._method = method; // Get the fetchHandler from the map created on app initialization

    this.fetchHandler = _handlerMap.handlerMap[apiId][method].fetchHandler; // Set a default cacheTimeout

    this.defaultCacheTimeout = 3600; // Initialize some fetch Parameters

    this.update(params);
  }

  _createClass(Fetch, [{
    key: "hasFetched",
    value: function hasFetched() {
      // Check the Redux fetch 
      if (this.method == 'GET') {
        return (0, _fetchCache.hasFetched)(_store["default"].getState(), this._fetchParams, this.cacheTimout);
      }

      return false;
    }
  }, {
    key: "hasData",
    value: function hasData() {
      // If there is a stateCheckFunc in the stateParams then use that to check
      // if data already exists in the redux store.
      var stateCheckFunc = this.params.stateParams.stateCheckFunc;

      if (!stateCheckFunc) {
        return null;
      }

      return stateCheckFunc(_store["default"].getState());
    }
  }, {
    key: "update",
    value: function update() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Note the second argument is redundant (you can pass the queryParams through the first "params" parameter if you want)
      // because they are mashed together here anyway
      params = this.preUpdateHook(_objectSpread({}, params, queryParams));
      var p = this.fetchHandler(params);
      this._fetchParams = p.fetchParams;
      this._stateParams = p.stateParams;
      return params;
    }
  }, {
    key: "updateStateParams",
    value: function updateStateParams() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Object.assign(this._stateParams, obj);
      return this.params;
    }
  }, {
    key: "updateFetchParams",
    value: function updateFetchParams() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Object.assign(this._fetchParams, obj);
      return this.params;
    }
  }, {
    key: "toggleForm",
    value: function toggleForm() {
      _store["default"].dispatch((0, _actionCreators.toggleForm)(this.params.stateParams));
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      if (this.hasFetched()) {
        return null;
      }

      var action = (0, _actionCreators.fetchToState)(this.params);
      this.preDispatchHook(action);

      _store["default"].dispatch(action);
    }
  }, {
    key: "hasRequiredParams",
    value: function hasRequiredParams(obj) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.requiredParams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var paramName = _step.value;

          if (!obj[paramName]) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    } // Setter functions for 

  }, {
    key: "dispatchFromProps",
    value: function dispatchFromProps(props, fetchedUrls, stateSet) {
      var forceFetch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      // Call the fetchHandler with the arguments provided 
      // NOTE: The newProps returned may be modified by a preUpdateHook
      var newProps = this.update(props); // Check that the required parameters are met

      if (!this.hasRequiredParams(newProps)) {
        return null;
      } // Check if the URL to be fetched has already been requested in the state


      var fetchParams = this.params.fetchParams;
      fetchedUrls = fetchedUrls || {};

      if (!fetchedUrls[fetchParams.url] || forceFetch == true) {
        // Dispatch this action
        this.dispatch(); // Update the fetched Urls flag with the flagSetter

        Object.assign(fetchedUrls, _defineProperty({}, fetchParams.url, true));
        stateSet({
          fetchedUrls: fetchedUrls
        });
      }
    }
  }, {
    key: "params",
    get: function get() {
      return {
        fetchParams: this._fetchParams,
        stateParams: this._stateParams
      };
    }
  }, {
    key: "url",
    get: function get() {
      return this._fetchParams ? this._fetchParams.url : null;
    }
  }, {
    key: "requiredParams",
    get: function get() {
      return (this._fetchParams ? this._fetchParams.requiredParams : []) || [];
    }
  }, {
    key: "queryParams",
    get: function get() {
      return (this._fetchParams ? this._fetchParams.queryParams : {}) || {};
    }
  }, {
    key: "cacheTimout",
    get: function get() {
      return this._fetchParams.cacheTime || this.defaultCacheTimeout * 1000;
    }
  }, {
    key: "method",
    get: function get() {
      return this._fetchParams ? this._fetchParams.method : null;
    }
  }]);

  return Fetch;
}();

exports["default"] = Fetch;