/*
fetchHandlers are low-level functions that simply return:
1) the fetchParam (fetch parameters) which is an object (dictionary) that just provides:
  * url: The URL of the endpoint to fetch
  * method: The HTTP method to 
  * apiId: The unique_id of the API which is used to generate the "handlerMap" on app initialization (see more below)

2) the stateParams which is an object containing a set of parameters that determine how to store/unpack the
fetched state into the Redux state.  The stateParams primarily contains:
  * stateSetFunc: A function that takes the fetch response (action.payload) and unpacks it into the Redux Store (state)
  * stateCheckFunc: A function that is used to check if the data already exists in the Redux store (returns true or false)

NOTE 1: *handlerMap* - On app initialization all of the fetchHandlers that have an apiId are mapped into an object that allows
one to reference the fetchHandler by apiId (which may be obtained from Swagger documentation) and HTTP method.  The handlerMap
maps to an other plain JS object which contains:
{
    fetchHandler: (the actual fetchHandler function),
    requiredParams: (required Parameters that must be in the components' props)
    queryParams: (optional Parameters that may be provided)
}
This allows you to get the appropriate fetchHandler function by API reference ID and NOT having to remember the name of all 
individual fetchHandler functions for each API endpoint.  This allows you to use the appropriate fetchHandler within a React 
component as in the example below.

NOTE 2: *fetchBindings* - "Binding" functions such as "fetchAndFlagState" are functions which will "bind" onto the class and
do the following BEFORE calling the fetchHandler:
  * Check that all of the parameters required for the fetch (ie. projectId, refId, trackerId, etc.) can be obtained from the
    component props (this.props).  If a parameter is missing then the fetchBinding returns with no action.  This means that
    the prop may still be loading other data that is required in order to determine the missing parameter and this fetch
    may be called in a later "componentDidUpdate" call.
  * Check that the data does not already exist in the Redux state (by calling the stateCheckFunc).  If the stateCheckFunc 
    returns "true" then the data has already been previously fetched and the fetch is blocked UNLESS the argument 
    "ignoreStateCheck" is set to true.
  * If the above two checks pass then the fetchHandler is called in order to retrieve the data.  At the time of calling then 
    the components state is flagged that that fetch handler URL has been called, so we can safely include a call to this
    binding in all component update methods in order to continuously check and re-fetch data as required to robustly obtain
    all data required to render a particular component.

import {handlerMap} from 'traec'
import {fetchData} from 'traec/fetchBindings/utils'

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        
        this.requiredFetches = [
            handlerMap['project_tracker']['list'],
            handlerMap['tracker']['list']
        ]
    }

    fetchData() {
        this.requiredFetches.map(fetchObj => fetchAndFlagState.bind(this)(fetchObj))
    }

    componentDidMount() {
        fetchData()
    }

    componentDidUpdate() {
        fetchData()
    }
}


*/

export * from "./target";
export * from "./projectMember";
export * from "./tree";
export * from "./projectReporting";
export * from "./projectDiscipline";
export * from "./head";
export * from "./commit";
export * from "./tracker";
export * from "./projectInvite";
export * from "./treeDescription";
export * from "./project";
export * from "./document";
export * from "./ref";
export * from "./projectSetup";
export * from "./projectAuthGroup";
export * from "./commitEdges";
export * from "./commitBranch";
export * from "./company";
export * from "./companyAuthGroup";
export * from "./companyInvite";
export * from "./companyMembers";
export * from "./companyReporting";
export * from "./metric";
export * from "./convFactors";
export * from "./companyTargets";
export * from "./companyIndicator";
export * from "./indicators";
export * from "./comment";
export * from "./projectEmail";