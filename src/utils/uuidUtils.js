/**
 * Grab the full UUIDs from a Redux state.
 *
 * This function is mostly used within mapStateToProps in order to destructure the full UUIDs from a
 * provided set of abbreviated UUIDS that have generally been provided through the URL and can be
 * accessed with props.match.params.
 *
 * So in the past you might have done this to get all of the UUIDs from the URL:
 * `const {companyId} = ownProps.match.params`
 *
 * Now you do it like this:
 * `const {companyId} = Traec.utils.getFullIds(state, ownProps.match.params)`
 *
 * @param {object} state A full Redux (immutable) state object
 * @param {object} params A plain JS object containing the (possibly short) ids as variables prefixed with an underscore (ie. _companyId)
 * @return {object} the full ids for each variable with the underscore removed (ie. {companyId}). This can be used to destructure the variables in a function.
 */
export const getFullIds = (
  state,
  params,
  varPaths = {
    projectId: "entities.projects.byId",
    companyId: "entities.companies.byId",
    refId: "entities.refs.byId",
    commitId: "entities.commits.byId",
    trackerId: "entities.trackers.byId"
  }
) => {
  // Copy the input params into the return variables
  let returnVars = { ...params };
  // Return empty if there are no params provided
  if (!params) {
    return returnVars;
  }
  // For each variable name try to get the value and confirm the real actual uuid from state
  for (let [varName, path] of Object.entries(varPaths)) {
    let paramId = params[`_${varName}`];
    let fullId = state.getInPath(`${path}.${paramId}.uid`);
    if (fullId) {
      returnVars[varName] = fullId;
    }
  }
  return returnVars;
};
