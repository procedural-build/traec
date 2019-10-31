import Im from "immutable";
import * as utils from "./utils/stateBindins";

/**
 * Patched Immutable.js library with some common methods that are used
 * in the API calls and fetchHandlers specific to Traec.
 *
 * If using immutable then import from here instead of immutable directly,
 * like so:
 * @example
 * // Change from this:
 * import Im from 'immutable';
 * //to this:
 * import Im from 'traec/immutable'
 * //or this:
 * import Traec from 'traec'
 * const {Im} = Traec
 *
 * @namespace immutable
 */

//Check if the browser is IE, and display the error message if true
var isIE = false || !!document.documentMode;

if (isIE) {
  alert(
    "The Sustainability Tool is no longer supported on Internet Explorer. Please use another internet browser application or contact us for more information. "
  );
  window.location = "error.html";
}

// Patch all of the functions from utils onto the Map prototype
// to make them available within Immutable.map objects
// NOTE: The Redux state should therefore be a Map object
for (let [name, func] of Object.entries(utils)) {
  Im.Map.prototype[name] = func;
}

export default Im;
