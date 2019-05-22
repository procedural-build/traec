"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchJSON = void 0;

var fetchJSON = function fetchJSON(config) {
  var path = config.path || "/";
  var method = config.method || "GET";
  var body = config.body;
  var successHandler = config.success;
  var failureHandler = config.failure;
  var token = localStorage.getItem("token"); //let headers = Object.assign({}, config.headers, {'content-type': 'application/json'})

  var headers = Object.assign({}, config.headers);

  if (!headers.hasOwnProperty('content-type')) {
    Object.assign(headers, {
      'content-type': 'application/json'
    });
  } else if (headers['content-type'] == null) {
    delete headers['content-type'];
  }

  if (token) {
    headers = Object.assign({}, headers, {
      "Authorization": "JWT ".concat(token)
    });
  } // Shall we stringify the body


  if (!config.rawBody) {
    body = JSON.stringify(body);
  } //console.log("REQUEST HEADERS", headers)
  //console.log("REQUEST BODY CONTENT: ", body)
  //console.log('FETHCING PATH', path)
  //if (method == 'PUT') { debugger }


  fetch(path, {
    method: method,
    headers: headers,
    body: body
  }).then(function (response) {
    if (!response.ok) {
      throw response;
    }

    if (response.status === 204) {
      return {};
    }

    if (headers['content-type'] === 'application/xlsx') {
      //debugger
      return response.blob();
    }

    return response.json();
  }).then(function (json) {
    successHandler(json);
  })["catch"](function (error) {
    console.warn("ERROR IN API FETCH to " + path, error);
    error.json().then(function (json) {
      console.log(json);
      failureHandler(json);
    });
  });
};

exports.fetchJSON = fetchJSON;