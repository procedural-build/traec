export const fetchJSON = (config) => {
       
    const path = config.path || "/";
    const method = config.method || "GET";
    let body = config.body

    const successHandler = config.success;
    const failureHandler = config.failure;

    const token = localStorage.getItem("token")
    //let headers = Object.assign({}, config.headers, {'content-type': 'application/json'})
    let headers = Object.assign({}, config.headers);
    if (!headers.hasOwnProperty('content-type')) {
        Object.assign(headers, {'content-type': 'application/json'})
    } else if (headers['content-type'] == null) {
        delete headers['content-type']
    }
    if (token) {
        headers = Object.assign({}, headers, {"Authorization": `JWT ${token}`});
    }

    // Shall we stringify the body
    if (!config.rawBody) {
        body = JSON.stringify(body)
    }

    //console.log("REQUEST HEADERS", headers)
    //console.log("REQUEST BODY CONTENT: ", body)
    //console.log('FETHCING PATH', path)
    //if (method == 'PUT') { debugger }

    fetch(path, {
        method: method,
        headers: headers,
        body: body
    })
    .then( response => {
        if (!response.ok) { throw response; }
        if (response.status === 204) { return {}; }
        if (headers['content-type'] === 'application/xlsx'){
            //debugger
            return response.blob()
        }
        return response.json();
    })
    .then( json => {
        successHandler(json)
    })
    .catch( error => {
        console.warn("ERROR IN API FETCH to " + path, error);
        error.json().then( json => {
            console.log(json);
            failureHandler(json)
        })
    })
};
