import * as fetchHandlers from './fetchHandlers';
import * as fetchBindings from './fetchBindings';
import {handlerMap} from './handlerMap';
import {fetchRequired} from './fetchBindings/utils';
import Fetch from './fetchManager'
import Im from './immutable'
import Redux from './redux'

export * from './handlerMap'
export * from './fetchBindings/utils'

export default {
    fetchHandlers,
    fetchBindings,
    handlerMap,
    fetchRequired,
    Fetch,
    Im,
    Redux
}

exports.printMsg = function() {
    console.log("This is a message from the traec package");
  }