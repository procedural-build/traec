import Im from 'immutable';
import * as utils from './utils/stateBindins'

/*
Patch Immutable with some common methods that are used
in the API calls and fetchHandlers.  

IMPORT FROM HERE INSTEAD OF IMMUTABLE DIRECTLY THROUGHOUT 
THE PROJECT, SO CHANGE FROM THIS:
import Im from 'traec/immutable';
TO THIS:
import Im from 'traec/immutable'
*/

// Patch all of the functions from utils onto the Map prototype
// to make them available within Immutable.map objects
// NOTE: The Redux state should therefore be a Map object
for (let [name, func] of Object.entries(utils)) {
    Im.Map.prototype[name] = func
}

export default Im