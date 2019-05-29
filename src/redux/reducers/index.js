//import { combineReducers } from 'redux';
import { combineReducers } from "redux-immutable";
import Im from "../../immutable";

import ui from "./uiReducer";
import entities from "./entitiesReducer";
import auth from "./reducers";
import fetch from "./fetchReducers";

const appReducer = combineReducers({
  ui,
  entities,
  auth,
  fetch
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = Im.fromJS({});
  }

  return appReducer(state, action);
};

export default rootReducer;
