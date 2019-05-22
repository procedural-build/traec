
export const hasFetched = (state, fetchParams, TIMELIM=1000) => {
    let {method, url} = fetchParams
    let key = `${method} ${url}`
    let details = state.getIn(['fetch', key])
    let now = new Date()
    if (details) {
        if (details.get('status') != 'failed') {
            let lastTimeSent = details.get('timeSent')
            if (lastTimeSent) {
                let dt = now - lastTimeSent
                if (dt < TIMELIM) {
                    return true
                } 
            }
        } 
    }
}

