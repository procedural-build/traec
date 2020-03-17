const addTrackerToState = (state, data) => {
  // Cut out the root_master ref data
  let refData = data.root_master;
  data.root_master = refData ? refData.uid : null;
  // Get the alternative root masters out
  let altRootMasters = data.alt_root_masters;
  let branchRefMap = {};
  if (altRootMasters) {
    for (let item of data.alt_root_masters) {
      branchRefMap[item.latest_commit.root_commit] = item.uid;
    }
    data.alt_root_masters = branchRefMap;
  }
  // Add the tracker and ref to dict
  let newState = state.addToDict("trackers.byId", data);
  // Add the root master
  if (refData) {
    newState = newState.addToDict("refs.byId", refData, "uid", refData.uid.substring(0, 8));
  }
  // Add in the alt root masters
  if (altRootMasters) {
    newState = newState.addListToDict("refs.byId", altRootMasters);
  }
  return newState;
};

export const getTracker = ({ trackerId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/`,
    apiId: "api_tracker_read"
  };
  const stateSetFunc = (state, action) => {
    return addTrackerToState(state, action.payload);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getTrackerList = ({ onlyTemplates = false }) => {
  let query_params = onlyTemplates ? "?onlyTemplates=true" : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${query_params}`,
    apiId: "api_tracker_list",
    requiredParams: [],
    queryParams: { onlyTemplates: false }
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    for (let item of data) {
      newState = addTrackerToState(newState, item);
      newState = newState.setInPath(`fetchFlags.trackers.${query_params}`, true);
    }
    return newState;
  };
  const stateCheckFunc = state => {
    return state.getInPath(`entities.fetchFlags.trackers.${query_params}`);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      stateCheckFunc
    }
  };
};

export const getTrackers = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/tracker/`,
    apiId: "api_project_tracker_list",
    requiredParams: ["projectId"],
    queryParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    for (let item of data) {
      newState = addTrackerToState(newState, item);
    }
    // Add the uids of the trackers to the project
    const trackerIds = data.map(item => ({ uid: item.uid, name: item.name }));
    newState = newState.addListToSets([`projects.byId.${projectId}.trackers`], trackerIds);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postTracker = ({ projectId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/project/${projectId}/tracker/`,
    apiId: "api_tracker_create"
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    // Not used if we add a tracker via a button (or async call)
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.setInPath(formVisPath, false);
      newState = addTrackerToState(newState, data);
      //newState = newState.addListToSets( [`projects.byId.${projectId}.trackers`],  [{ uid: data.uid, name: data.name }])
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `trackers.${projectId}.SHOW_FORM`,
      formObjPath: `trackers.${projectId}.newItem`
    }
  };
};

export const putTracker = ({ trackerId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/`,
    apiId: "api_tracker_update"
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    // Not used if we add a tracker via a button (or async call)
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.setInPath(formVisPath, false);
      newState = addTrackerToState(newState, data);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const patchTracker = ({ trackerId }) => {
  let { fetchParams, stateParams } = putTracker({ trackerId });
  Object.assign(fetchParams, { method: "PATCH" });
  return { fetchParams, stateParams };
};

export const postTrackerDispatch = ({ trackerId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/dispatch/`,
    apiId: "api_tracker_dispatch_create",
    headers: { "content-type": undefined },
    rawBody: true
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;

    if (data.errors) {
      let newState = state.setInPath(`errors.tracker.byId.${trackerId}.dispatch`, data.errors);
      return newState;
    }
    return state;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
