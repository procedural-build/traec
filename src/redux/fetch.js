export const fetchJSON = ({ path = "/", method = "GET", body, headers = {}, rawBody = null }, success, failure) => {
  const successHandler = success;
  const failureHandler = failure;

  headers = updateHeaders(headers);
  body = updateBody(body, rawBody);

  fetch(path, {
    method: method,
    headers: headers,
    body: body
  })
    .then(response => checkResponse(response, headers))
    .then(json => {
      successHandler(json);
    })
    .catch(error => {
      console.warn("ERROR IN API FETCH to " + path, error);
      error.json().then(json => {
        console.log(json);
        failureHandler(json);
      });
    });
};

const updateHeaders = function(headers) {
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

const updateBody = function(body, rawBody) {
  // Shall we stringify the body
  if (!rawBody) {
    body = JSON.stringify(body);
  }

  return body;
};

const checkResponse = function(response, headers) {
  if (!response.ok) {
    throw response;
  }
  if (response.status === 204) {
    return {};
  }
  if (headers["content-type"] === "application/xlsx") {
    //debugger
    return response.blob();
  }
  return response.json();
};
