import Im from "../../src/immutable";
//import auth from "../../src/redux/reducers/reducers";
import * as types from "../../src/redux/reducers/types";
import jwt_decode from "jwt-decode";
jest.mock("jwt-decode");

xdescribe("Fetch Reducer", () => {
  const initialState = Im.fromJS({});

  it("should handle LOGIN_SUCCESS", () => {
    const decoded_token = {
      user_id: "4af06b93-fd82-4636-a467-f4d9073a85ef",
      username: "admin",
      exp: 1559207709,
      email: "admin@ods-track.com"
    };
    jwt_decode.mockImplementation(() => decoded_token);
    const fetchParams = {
      url: "/auth-jwt/verify/",
      method: "POST",
      body: {
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
      }
    };

    const data = {
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
      user: {
        first_name: "",
        last_name: "",
        email: "admin@ods-track.com",
        username: "admin",
        is_superuser: true,
        is_tenant_superuser: true
      },
      errors: null
    };

    const expected = Im.fromJS({ ...data, status: "confirmed", isAuthenticated: true, decoded_token });

    expect(
      auth(initialState, {
        type: types.LOGIN_SUCCESS,
        payload: data,
        stateParams: null,
        fetchParams
      })
    ).toEqual(expected);
  });
});
