import { combineReducers } from "redux-immutable";
import Im from "../../immutable";

import entities from "./entitiesReducer";
import auth from "./reducers";

/* 
Class for accessing the root namespace of the state.  We should not need
this as we can use the "entities" namespace as the root for most objects

Refer to: 
http://blog.jakoblind.no/code-your-own-combinereducers/ 
https://medium.com/front-end-hacking/using-immutable-js-with-redux-ba89025e45e2
*/

const initialState = Im.fromJS({
  test: false
});
/**
 * rootAccess.js line 22
 * @memberof redux.reducers
 * @param state
 * @param action
 */
const rootNamespaceReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      console.log("CALLING ROOT REDUCER!!");
      return Object.assign({}, state, {
        test: true,
        auth: { test: true }
      });
  }
};

const domainReducers = combineReducers({
  entities,
  auth,
  projects,
  project
});

const combineReducersWithRoot = (state = {}, action) => {
  const nextState = {};
  // Apply the root namespace reducer
  Object.assign(nextState, rootNamespaceReducer(state, action));
  // Apply the domain reducers
  Object.assign(nextState, domainReducers(state, action));
  return nextState;
};

//export default combineReducersWithRoot
export default combineReducersWithRoot;
