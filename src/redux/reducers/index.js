import { combineReducers } from "redux-immutable";
import Im from "../../immutable";

import ui from "./uiReducer";
import entities from "./entitiesReducer";
import auth from "./reducers";
import fetch from "./fetchReducers";

/**
 * Redux Middleware for API Fetches
 * @memberof redux
 * @namespace reducers
 */

const appReducer = combineReducers({
  ui,
  entities,
  auth,
  fetch,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_SUCCESS") {
    state = Im.fromJS({});
  }

  return appReducer(state, action);
};

export default rootReducer;
