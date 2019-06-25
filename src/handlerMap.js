import * as fh from "./fetchHandlers";

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

const makeHandlerMap = function() {
  console.log("MAKING fetchHandler MAP");
  let handlerMap = {};
  for (let funcName of Object.keys(fh)) {
    try {
      let fetchHandler = fh[funcName];
      let { fetchParams, stateParams } = fetchHandler({});
      if (!fetchParams) {
        //console.warn("Skipping function in fetchhandler with fetchParams undefined", fetchHandler)
        continue;
      }
      let { apiId, method } = fetchParams;
      if (apiId) {
        //console.log(`FOUND API ID ${apiId}`)
        let parts = apiId.split("_");
        let endIndex = apiId.endsWith("partial_update") ? parts.length - 2 : parts.length - 1;
        let prefix = parts.slice(1, endIndex).join("_");
        // Get the action of the fetch
        let action = parts.slice(endIndex, parts.length).join("_");
        if (["POST", "PUT", "PATCH"].indexOf(method) > -1) {
          action = method.toLowerCase();
        }
        let actionMap = handlerMap[prefix] || {};
        actionMap[action] = {
          fetchHandler: fetchHandler,
          requiredParams: fetchParams.requiredParams || [],
          queryParams: fetchParams.queryParams || []
        };
        // Assign the updated action map to the handlerMap
        Object.assign(handlerMap, { [prefix]: actionMap });
      }
    } catch (err) {
      //console.warn("Error constructing handlerMap", err)
      continue;
    }
  }
  return handlerMap;
};

export const handlerMap = makeHandlerMap();
