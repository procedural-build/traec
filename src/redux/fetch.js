/**
 * Redux Middleware for API Fetches
 * @memberof redux
 * @namespace fetch
 */

/**
 * Traec main (lowest level) fetch call. Handles the header and body modifications
 * before it makes the fetch.
 * Afterwards success, failure and error handling are done.
 * @method
 * @memberof redux.fetch
 * @param {string} path - api call path
 * @param {string} method - REST methods [GET, PUT, PATCH, DELETE]
 * @param {object} body - Body to send with request
 * @param {object} headers - Headers to send with request
 * @param {boolean} rawBody - Whether or not the body should be send unprocessed
 * @param {function} success - SuccessHandler function
 * @param {function} failure - FailureHandler function
 */
export const fetchJSON = ({ url = "/", method = "GET", body, headers = {}, rawBody = false }, success, failure) => {
  const successHandler = success;
  const failureHandler = failure;

  headers = updateHeaders(headers);
  body = updateBody(body, rawBody);
  fetch(url, {
    method: method,
    headers: headers,
    body: body
  })
    .then(response => checkResponse(response, headers))
    .then(json => {
      successHandler(json);
    })
    .catch(error => {
      console.warn("ERROR IN API FETCH to " + url, error);
      if (typeof error === "object" && !error.type) {
        failureHandler(error);
      } else {
        error.json().then(json => {
          console.log("Error", json);
          failureHandler(json);
        });
      }
    });
};

/**
 * Updates the headers before fetch is sent.
 * The access token is attached to the headers at this stage.
 * If the headers don't have a "content-type" key, the key will be attached with the
 * value: application/json. If content-type exists but have value null the key-value pair wil be removed.
 * @method
 * @memberof redux.fetch
 * @param {object} headers
 */
export const updateHeaders = function(headers) {
  const token = localStorage.getItem("token");

  if (!headers.hasOwnProperty("content-type")) {
    Object.assign(headers, { "content-type": "application/json" });
  } else if (headers["content-type"] == null) {
    delete headers["content-type"];
  }
  if (token) {
    headers = Object.assign({}, headers, { Authorization: `JWT ${token}` });
  }

  return headers;
};

/**
 * Stringifies the body if rawBody is not defined
 * @method
 * @memberof redux.fetch
 * @param {object} body
 * @param {boolean} rawBody
 */
export const updateBody = function(body, rawBody) {
  // Shall we stringify the body
  if (!rawBody) {
    body = JSON.stringify(body);
  }

  return body;
};

/**
 * Checks the response. If the content-type header is "application/xlsx".
 * The response will be returned as a blob otherwise it will be returned as json.
 * @method
 * @memberof redux.fetch
 * @param response
 * @param headers
 */
export const checkResponse = function(response, headers) {
  if (!response.ok) {
    throw response;
  }
  if (response.status === 204) {
    return {};
  }
  if (headers["content-type"] === "application/xlsx") {
    return response.blob();
  }
  return response.json();
};
