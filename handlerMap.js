"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerMap = void 0;

var fh = _interopRequireWildcard(require("./fetchHandlers"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
Object for getting the fetch handler functions to use based on API endpoint.
The map also includes methods for checking if the object already exists in
the Redux State

NOTE: the FIRST key is the API reference (ie api_company_list) but with the
prefix "api_" removed and the action-suffix (ie. _list) also removed.  The 
second KEY is the http method which are:
    list    = list
    read    = read
    post    = create
    put     = update
    patch   = update
    delete  = delete

{
    company: {
        list: fh.fetchCompanies
    },
    company_invite_all: {
        list: fh.fetchAllCompanyInvites
    },
    company_invite: {
        list: fh.fetchCompanyInvites,
    }
}
*/
var makeHandlerMap = function makeHandlerMap() {
  console.log("MAKING fetchHandler MAP");
  var handlerMap = {};

  for (var _i = 0, _Object$keys = Object.keys(fh); _i < _Object$keys.length; _i++) {
    var funcName = _Object$keys[_i];

    try {
      var fetchHandler = fh[funcName];

      var _fetchHandler = fetchHandler({}),
          fetchParams = _fetchHandler.fetchParams,
          stateParams = _fetchHandler.stateParams;

      var apiId = fetchParams.apiId,
          method = fetchParams.method;

      if (apiId) {
        //console.log(`FOUND API ID ${apiId}`)
        var parts = apiId.split('_');
        var endIndex = apiId.endsWith('partial_update') ? parts.length - 2 : parts.length - 1;
        var prefix = parts.slice(1, endIndex).join('_'); // Get the action of the fetch

        var action = parts.slice(endIndex, parts.length).join('_');

        if (['POST', 'PUT', 'PATCH'].indexOf(method) > -1) {
          action = method.toLowerCase();
        }

        var actionMap = handlerMap[prefix] || {};
        actionMap[action] = {
          fetchHandler: fetchHandler,
          requiredParams: fetchParams.requiredParams || [],
          queryParams: fetchParams.queryParams || [] // Assign the updated action map to the handlerMap

        };
        Object.assign(handlerMap, _defineProperty({}, prefix, actionMap));
      }
    } catch (err) {
      //console.warn("Error constructing handlerMap", err)
      continue;
    }
  }

  return handlerMap;
};

var handlerMap = makeHandlerMap();
exports.handlerMap = handlerMap;