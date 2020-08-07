import Im from "../../immutable";
import { setPath } from "../../utils";

const nodeNameMap = {
  metricscore: "metricScores",
  metrictarget: "metricTargets",
  metriccalculation: "metricCalculations",
  conversionfactor: "conversionFactors",
  tree: "trees",
  document: "documents",
  trackercomment: "comments",
  trackerdescription: "descriptions"
};

const setPathChildren = pathMap => {
  for (let [path, value] of Object.entries(pathMap)) {
    let nodeType = nodeNameMap[value.type] || value.type;
    let parentPath = path.substring(0, path.length - 7);
    if (!parentPath || parentPath == "") {
      continue;
    }
    let parent = pathMap[parentPath];
    if (!parent) {
      console.warn(`No parent found for path ${path}`, value);
      continue;
    }
    if (!parent["children"]) {
      parent["children"] = {
        byPath: Im.Set(),
        byType: {}
      };
    }
    // Index all children together according to their path
    parent["children"]["byPath"] = parent["children"]["byPath"].add(path);
    // Index the children according to their type (for more rapid search of children of a particular type later)
    if (!parent["children"]["byType"][nodeType]) {
      parent["children"]["byType"][nodeType] = Im.Set();
    }
    parent["children"]["byType"][nodeType] = parent["children"]["byType"][nodeType].add(path);
  }
  return pathMap;
};

const mapNodes = data => {
  let pathMap = {};
  let nodeMap = {};
  let nodeIds = {};
  for (let item of data) {
    let nodeType = nodeNameMap[item.type] || item.type;
    let data = item.node[item.type];
    if (!nodeMap[nodeType]) {
      nodeMap[nodeType] = { byId: {} };
      nodeIds[nodeType] = Im.Set();
    }
    nodeMap[nodeType]["byId"][data.uid] = data;
    nodeIds[nodeType] = nodeIds[nodeType].add(data.uid);
    pathMap[item.path] = {
      type: item.type,
      uid: data.uid
    };
  }
  let pathRoot = null;
  if (data.length) {
    pathRoot = data[0].path ? data[0].path.substring(0, 7) : null;
  }
  pathMap = setPathChildren(pathMap);
  return { pathMap, nodeMap, nodeIds, pathRoot };
};

const getPtr = (commitId, refId) => {
  // Get the type of pointer we are using
  let ptrId = commitId || refId;
  let ptr = ptrId == commitId ? "commit" : "ref";
  return { ptrId, ptr };
};

export const getTrackerNodes = ({ trackerId, commitId, refId }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/`,
    apiId: "api_tracker_node_list",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    // Remap the data to a dictionary
    let { pathMap, nodeMap, nodeIds, pathRoot } = mapNodes(data);
    // Set the path root for reference
    newState = newState.setInPath(`commitNodes.${commitId}.pathRoot`, pathRoot);
    // Add the list of node types, uids and paths
    newState = newState.setInPath(`commitNodes.${commitId}.byPath`, pathMap);
    // Set a list of the node Ids by type in this commit
    newState = newState.setInPath(`commitNodes.${commitId}.byType`, nodeIds);
    // Add the list of node types
    newState = newState.merge(Im.fromJS(nodeMap));
    return newState;
  };
  const stateCheckFunc = state => {
    return !(state.getInPath(`entities.commitNodes.${commitId}.byPath`) == null);
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      stateCheckFunc
    }
  };
};

export const postTrackerNode = ({ trackerId, commitId, refId }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/`,
    apiId: "api_tracker_node_create",
    requiredParams: ["trackerId", "commitId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    // Map the new value as if it were an incoming list
    let { pathMap, nodeMap, nodeIds } = mapNodes([data]);
    // Merge in the pathMap
    newState = newState.mergeInPath(`commitNodes.${commitId}.byPath`, pathMap);
    // Set a list of the node Ids by type in this commit
    for (let [nodeType, id] of Object.entries(nodeIds)) {
      newState = newState.mergeInPath(`commitNodes.${commitId}.byType.${nodeType}`, id);
    }
    // Add the nodes to the global set
    for (let [nodeType, nodeData] of Object.entries(nodeMap)) {
      newState = newState.mergeInPath(`${nodeType}.byId`, Im.fromJS(nodeData.byId));
    }
    // Set the parent relations
    for (let [path, value] of Object.entries(pathMap)) {
      let nodeType = nodeNameMap[value.type] || value.type;
      let parentPath = path.substring(0, path.length - 7);
      let parentChildrenPath = `commitNodes.${commitId}.byPath.${parentPath}.children`;
      let parentChildren = newState.getInPath(parentChildrenPath);
      if (!parentChildren) {
        newState = newState.setInPath(parentChildrenPath, {
          byPath: Im.Set(),
          byType: {
            [nodeType]: Im.Set()
          }
        });
      }
      let pathSet = Im.Set([path]);
      newState = newState.mergeInPath(`${parentChildrenPath}.byType.${nodeType}`, pathSet);
      newState = newState.mergeInPath(`${parentChildrenPath}.byPath`, pathSet);
    }
    // Return the new state
    return newState;
  };
  return {
    fetchParams,
    stateParams: { stateSetFunc, formVisPath: `metricTargets.SHOW_FORM`, formObjPath: `metricTargets.newItem` }
  };
};

export const putCommitNode = ({ trackerId, commitId, refId, pathId }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/${pathId}/`,
    apiId: "api_tracker_node_update",
    requiredParams: ["trackerId", "commitId", "pathId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    // Remove the old value if the node is replaced

    // Load in the new values

    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const patchCommitNode = ({ trackerId, commitId, refId, pathId }) => {
  let params = putCommitNode({ trackerId, commitId, refId, pathId });
  Object.assign(params.fetchParams, {
    method: "PATCH",
    apiId: "api_tracker_node_partial_update"
  });
  return params;
};

export const deleteCommitNode = ({ trackerId, commitId, refId, pathId }) => {
  let { ptr, ptrId } = getPtr(commitId, refId);
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/${ptr}/${ptrId}/node/${pathId}/`,
    apiId: "api_tracker_node_delete",
    requiredParams: ["trackerId", "commitId", "pathId"],
    queryParams: {}
  };
  const stateSetFunc = (state, action) => {
    return state.removeInPath(`commitNodes.${commitId}.byPath.${pathId}`);
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
