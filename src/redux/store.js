import Im from "../immutable";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { callAPIMiddleware } from "./apiMiddleware";
import { composeWithDevTools } from "redux-devtools-extension";

/**
 * Redux store (Immutable) for client-side data management.
 * @namespace store
 * @memberof redux
 */

const initialState = Im.fromJS({});

const middleware = [thunk, callAPIMiddleware];

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
