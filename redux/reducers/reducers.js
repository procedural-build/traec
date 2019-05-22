"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _immutable = _interopRequireDefault(require("traec/immutable"));

var types = _interopRequireWildcard(require("./types"));

var _jwtDecode = _interopRequireDefault(require("jwt-decode"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var initialState = _immutable["default"].fromJS({
  isAuthenticated: false,
  token: {},
  errors: null
});

function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  //console.log("Reducing auth data")
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      var token = action.payload.token;
      localStorage.setItem('token', token);
      var decoded_token = token ? (0, _jwtDecode["default"])(token) : null;
      return state.merge(_immutable["default"].fromJS(action.payload), _immutable["default"].fromJS({
        isAuthenticated: true,
        status: 'confirmed',
        decoded_token: decoded_token
      }));

    case types.LOGIN_STATUS:
      return state.merge(_immutable["default"].fromJS(action.payload));

    case types.LOGIN_FAILURE:
      //console.log("LOGIN FAILURE", action.payload)
      localStorage.removeItem('token');
      return state.merge(_immutable["default"].fromJS(action.payload), _immutable["default"].fromJS({
        isAuthenticated: false,
        token: null,
        errors: action.payload ? action.payload.errors : null,
        status: 'failed'
      }));

    case types.REGISTER_SUCCESS:
      return state.mergeIn(['registration'], _immutable["default"].fromJS({
        redirect: 'register_success_confirm'
      }));

    case types.REGISTER_FAILURE:
      return state.mergeIn(['registration'], _immutable["default"].fromJS(action.payload));

    case types.ACTIVATE_SUCCESS:
      return state.mergeIn(['registration', 'activate'], _immutable["default"].fromJS({
        status: 'confirmed'
      }));

    case types.ACTIVATE_FAILURE:
      return state.mergeIn(['registration', 'activate'], _immutable["default"].fromJS({
        status: 'failed',
        errors: action.payload.errors
      }));

    case types.RESET_SUCCESS:
      return state.mergeIn(['registration', 'password_reset'], _immutable["default"].fromJS({
        status: 'confirmed'
      }));

    case types.RESET_PENDING:
      return state.mergeIn(['registration', 'password_reset'], _immutable["default"].fromJS({
        status: 'pending'
      }));

    case types.RESET_FAILURE:
      return state.mergeIn(['registration', 'password_reset'], _immutable["default"].fromJS({
        status: 'failed',
        errors: action.payload.errors
      }));

    default:
      return state;
  }

  ;
}

;