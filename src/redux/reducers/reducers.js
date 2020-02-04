import Im from "../../immutable";
import store from "../store";
import * as types from "./types";
import jwt_decode from "jwt-decode";

const initialState = Im.fromJS({
  isAuthenticated: false,
  token: {},
  errors: null
});

class TokenRefresher {
  constructor() {
    this.intervals = {};

    this.doRefresh = this.doRefresh.bind(this);
  }

  doRefresh(refreshToken) {
    // Dispatch an action that will be caught by the APIMiddleware for fetching
    console.log("Requesting refresh for JWT token");
    // Get the token-refresh
    let fetchParams = {
      url: "/auth-jwt/refresh/",
      method: "POST",
      body: {
        refresh: refreshToken
      }
    };
    store.dispatch({
      APICallTypes: {
        successType: "LOGIN_SUCCESS",
        failureType: "LOGIN_FAILURE"
      },
      fetchParams
    });
  }

  setRefresh(exp, refreshToken) {
    let now = new Date();
    let expTime = new Date(exp * 1000);
    let msRemaining = expTime - now - 10 * 1000;
    console.log("Refreshing access token again in ", msRemaining / 1000, "seconds");
    let id = setInterval(
      refreshToken => {
        // Only do it once
        this.doRefresh(refreshToken);
        clearInterval(id);
      },
      msRemaining,
      refreshToken
    );
    this.intervals[id] = refreshToken;
  }

  clearAll() {
    for (let id in this.intervals) {
      clearInterval(id);
    }
    this.intervals = {};
  }
}

const TOKEN_REFRESHER = new TokenRefresher();

export default function(state = initialState, action) {
  //console.log("Reducing auth data")
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      // Try to get the token from either "token" or "access" keys
      let token = action.payload.access || action.payload.token;
      let refresh = action.payload.refresh || localStorage.getItem("token-refresh");
      // If we have a new token then store that in localStorage
      if (token) {
        localStorage.setItem("token", token);
        // Store the refreshToken in localStorage also
      } else {
        token = localStorage.getItem("token");
      }
      // Store the refresh token in localStorage also (if provided)
      if (action.payload.refresh) {
        localStorage.setItem("token-refresh", refresh);
      }
      // Decode the access token for display in Redux
      let decoded_token = token ? jwt_decode(token) : null;
      // Set a timer to request a new token
      if (decoded_token.exp && refresh) {
        TOKEN_REFRESHER.clearAll();
        TOKEN_REFRESHER.setRefresh(decoded_token.exp, refresh);
      }
      // Add this data to your Redux
      return state.merge(
        Im.fromJS({
          ...action.payload,
          token,
          access: token,
          refresh: refresh,
          isAuthenticated: true,
          status: "confirmed",
          decoded_token
        })
      );

    case types.LOGIN_STATUS:
      return state.merge(Im.fromJS(action.payload));

    case types.LOGIN_FAILURE:
      localStorage.removeItem("token");
      return state.merge(
        Im.fromJS(action.payload),
        Im.fromJS({
          isAuthenticated: false,
          token: null,
          errors: action.payload ? action.payload.errors : null,
          status: "failed"
        })
      );

    case types.REGISTER_SUCCESS:
      return state.mergeIn(
        ["registration"],
        Im.fromJS({
          redirect: "register_success_confirm"
        })
      );
    case types.REGISTER_FAILURE:
      return state.mergeIn(["registration"], Im.fromJS(action.payload));
    case types.ACTIVATE_SUCCESS:
      return state.mergeIn(
        ["registration", "activate"],
        Im.fromJS({
          status: "confirmed"
        })
      );
    case types.ACTIVATE_FAILURE:
      return state.mergeIn(
        ["registration", "activate"],
        Im.fromJS({
          status: "failed",
          errors: action.payload.errors
        })
      );
    case types.RESET_SUCCESS:
      return state.mergeIn(
        ["registration", "password_reset"],
        Im.fromJS({
          status: "confirmed"
        })
      );
    case types.RESET_PENDING:
      return state.mergeIn(
        ["registration", "password_reset"],
        Im.fromJS({
          status: "pending"
        })
      );
    case types.RESET_FAILURE:
      return state.mergeIn(
        ["registration", "password_reset"],
        Im.fromJS({
          status: "failed",
          errors: action.payload.errors
        })
      );
    default:
      return state;
  }
}
