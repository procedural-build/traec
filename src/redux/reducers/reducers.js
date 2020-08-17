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
  /*NOTE: that the refresh token is NOT stored in localStorage for security
    This is set in a httpOnly cookie by the server at the `/jwt-auth/get/` endpoint
    and is issued only to the `/jwt-auth/refresh/` endpoint on the same domain.

    So we burn the refresh token here - it is not stored anywhere accessible to JavaScript.
    
    We trust that the browser will securely store the httpOnly cookie with the appropriate
    refresh token.
  */

  constructor() {
    this.intervals = {};
    this.doRefresh = this.doRefresh.bind(this);
  }

  doRefresh() {
    // Dispatch an action that will be caught by the APIMiddleware for fetching
    console.log("Requesting refresh for JWT token");
    store.dispatch({
      APICallTypes: {
        successType: "LOGIN_SUCCESS",
        failureType: "LOGIN_FAILURE"
      },
      fetchParams: {
        url: "/auth-jwt/refresh/",
        method: "POST",
        body: { refresh: null } // The refresh token should be in the httpOnly cookie that is sent
      }
    });
  }

  setRefresh(exp, refreshToken) {
    let now = new Date();
    let expTime = new Date(exp * 1000);
    let msRemaining = expTime - now - 10 * 1000;
    console.log("Refreshing access token again in ", msRemaining / 1000, "seconds");
    let id = setInterval(
      refreshToken => {
        // Only do it once - the next access token will set another interval
        this.doRefresh(refreshToken);
        clearInterval(id);
      },
      msRemaining,
      refreshToken
    );
    this.intervals[id] = true;
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
      // Try to get the access token from either "token" or "access" keys
      let { access, token, user } = action.payload;
      token = access || token;
      // If we have a new token then store that in localStorage
      if (token) {
        localStorage.setItem("token", token);
      } else {
        token = localStorage.getItem("token");
      }
      // Decode the access token for display in Redux
      let decoded_token = token ? jwt_decode(token) : null;
      // Set a timer to request a new token
      if (decoded_token.exp) {
        TOKEN_REFRESHER.clearAll();
        TOKEN_REFRESHER.setRefresh(decoded_token.exp);
      }
      // Add this data to your Redux
      for (let key of ["access", "refresh", "token"]) {
        delete action.payload[key];
      }
      // Get a mock user object (if the user data is not provided in the response)
      if (!user) {
        user = { ...decoded_token };
        for (let key of ["token_type", "exp", "jti"]) {
          delete user[key];
        }
      }
      // The data that will be set
      return state.merge(
        Im.fromJS({
          ...action.payload,
          token,
          isAuthenticated: true,
          status: "confirmed",
          decoded_token,
          user
        })
      );

    case types.LOGIN_STATUS:
      return state.merge(Im.fromJS(action.payload));

    case types.LOGIN_FAILURE:
      localStorage.setItem("token", "failed");
      return state.merge(
        Im.fromJS(action.payload),
        Im.fromJS({
          isAuthenticated: false,
          token: null,
          errors: action.payload ? action.payload.errors : null,
          status: "failed"
        })
      );

    case types.LOGOUT_SUCCESS:
      console.log("LOGOUT SUCCESSFUL");
      localStorage.setItem("token", "undefined");
      return Im.fromJS({});

    case types.LOGOUT_FAILURE:
      console.log("LOGOUT FAILURE");
      alert("Error logging out");
      return state;

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
