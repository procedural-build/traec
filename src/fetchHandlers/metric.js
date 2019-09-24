import Crypto from "crypto";
import { postTree } from "./tree";
import Im from "../immutable";

/*
When we make a metric we will also create a folder for the metric 
(and any evidence/documents that might be required later).  
We will do this using Redux Thunk middleware to pass functions in
an action -> which can then dispatch more actions in itself.  This 
allows us to create Async Action Creators as discussed in the official
Redux documentation here:
https://redux.js.org/advanced/asyncactions#reducers-js
*/

export const postTreeScore = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/score/`,
    apiId: "api_tracker_ref_tree_score_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      // Add this item to the trackerImpact
      let baseMetric = data.metric;
      data.metric = baseMetric.uid;
      newState = newState.addToDict("metricScores.byId", data);
      newState = newState.addToDict("baseMetrics.byId", baseMetric);
      // Add it to the edges of its parent tree also
      newState = newState.addListToSet(`commitEdges.byId.${commitId}.trees.${treeId}.metricScores`, [data.uid]);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postTreeAndMetric = ({ trackerId, refId, commitId, treeId }) => {
  /* Handler to create a tree and then immediately create a metric if the tree returns success
    We are modifying the body before calling fetch and giving a random string to the
    tree (we will not use the tree name itself - but the metric name)
    Attach a handler to the fetchParams, so that if successful in creating a tree
    then we will immediately dispatch to create a metric on that tree.
    */
  // Create the tree fetch handler
  let { fetchParams, stateParams } = postTree({ trackerId, refId, commitId, treeId });
  Object.assign(fetchParams, { apiId: "api_tracker_ref_tree_tree_and_metric_create" });
  // Modify the post to give a random name for the tree
  Object.assign(fetchParams, {
    preFetchHook: body => {
      return {
        name: Crypto.createHash("sha1")
          .update(body.name)
          .digest("hex")
      };
    },
    // Attach a nextHandler to the tree - so that the metricscore is created on successful creation of the tree
    nextHandlers: [
      (data, post, orgpost) => {
        let { fetchParams, stateParams } = postTreeScore({ trackerId, refId, commitId, treeId: data.uid });
        Object.assign(fetchParams, {
          body: {
            metric: { ...orgpost }
          }
        });
        return { fetchParams, stateParams };
      }
    ]
  });
  return { fetchParams, stateParams };
};

export const postTrackerMetric = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/impact/`
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict("trackerImpact.byId", data);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const isString = i => {
  return typeof i === "string" || i instanceof String;
};

export const addValueToState = (state, commitId, item) => {
  let imItem = Im.fromJS(item);
  /* Save the input as a */
  let newState = state;
  // Strip out the parts
  let metricScoreId = null;
  let baseMetricId = null;
  if (isString(item.metric)) {
    metricScoreId = item.metric;
    metricScore = newState.getInPath(`metricScores.byId.${metricScoreId}`);
    baseMetricId = metricScore.objects.get("metric");
    imItem = imItem.set("baseMetric", baseMetricId);
  } else {
    baseMetricId = item.metric.metric.uid;
    metricScoreId = item.metric.uid;
    // Add the baseMetric and metricScore objects to flat lists
    newState = newState.addToDict(`baseMetrics.byId`, item.metric.metric);
    newState = newState.setInPath(
      `metricScores.byId.${metricScoreId}`,
      Im.fromJS(item.metric).set("metric", baseMetricId)
    );
    // Change the immutable object to have referenced to these objects
    imItem = imItem.set("metric", metricScoreId);
    imItem = imItem.set("baseMetric", baseMetricId);
  }
  // Add indexed against metricScore
  newState = newState.setInPath(`commitEdges.byId.${commitId}.scoreValues.${metricScoreId}.values.${item.uid}`, imItem);
  // Add to an indexed list by baseMetric
  newState = newState.setInPath(
    `commitEdges.byId.${commitId}.bmScoreValues.${baseMetricId}.values.${item.uid}`,
    imItem
  );
  return newState;
};

export const getMetricInputs = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/value/`,
    apiId: "api_tracker_commit_value_list",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    // Clear the existing values
    let newState = state.setInPath(`commitEdges.byId.${commitId}.scoreValues`, {});
    newState = newState.setInPath(`commitEdges.byId.${commitId}.bmScoreValues`, {});
    // Load in the new values
    for (let item of data) {
      newState = addValueToState(newState, commitId, item);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

/* Post a single value for a metric */
export const postMetricScoreValue = ({ trackerId, commitId, scoreId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/commit/${commitId}/score/${scoreId}/value/`,
    apiId: "api_tracker_commit_score_value_create",
    requiredParams: ["trackerId", "commitId", "scoreId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = addValueToState(newState, commitId, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

/* Put/update single value for a metric */
export const putMetricScoreValue = ({ trackerId, commitId, scoreId, inputValueId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/commit/${commitId}/score/${scoreId}/value/${inputValueId}/`,
    apiId: "api_tracker_commit_score_value_update",
    requiredParams: ["trackerId", "commitId", "scoreId", "inputValueId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = addValueToState(newState, commitId, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

/* Post multiple values for a metric */
export const postCommitScoreValues = ({ trackerId, commitId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/commit/${commitId}/value/`,
    apiId: "api_tracker_commit_value_create",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addListToDict(`commitEdges.byId.${commitId}.scoreValues.${scoreId}.values`, data);
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const patchTreeScore = ({ trackerId, refId, commitId, treeId, metricScoreId }) => {
  const fetchParams = {
    method: "PATCH",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/score/${metricScoreId}/`,
    apiId: "api_tracker_ref_tree_score_partial_update",
    requiredParams: ["trackerId", "refId", "commitId", "treeId", "metricScoreId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      // Add this item to the trackerImpact
      let baseMetric = data.metric;
      data.metric = baseMetric.uid;
      newState = newState.addToDict("metricScores.byId", data);
      newState = newState.addToDict("baseMetrics.byId", baseMetric);
      // Add it to the edges of its parent tree also
      newState = newState.addListToSet(`commitEdges.byId.${commitId}.trees.${treeId}.metricScores`, [data.uid]);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `trees.editById.${treeId}.SHOW_EDIT_SCORE_FORM`,
      formObjPath: `trees.editById.${treeId}.editMetric`
    }
  };
};
