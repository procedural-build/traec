import Im from "../../immutable";

export const nodeNameMap = {
  metricscore: "metricScores",
  metrictarget: "metricTargets",
  metriccalculation: "metricCalculations",
  conversionfactor: "conversionFactors",
  tree: "trees",
  document: "documents",
  trackercomment: "comments",
  trackerdescription: "descriptions",
  categoryrevset: "revsets",
  categorycommit: "commits",
  categoryhead: "heads"
};

export const setPathChildren = pathMap => {
  for (let [path, value] of Object.entries(pathMap)) {
    let nodeType = nodeNameMap[value.type] || value.type;
    let parentPath = path.substring(0, path.length - 7);
    if (!parentPath || parentPath == "") {
      continue;
    }
    // Get or create the parent path
    if (!pathMap[parentPath]) {
      pathMap[parentPath] = {};
    }
    let parent = pathMap[parentPath];
    // Initialize a placeholder for children data
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

const addToNodeMap = (nodeMap, nodeType, data) => {
  if (!nodeMap[nodeType]) {
    nodeMap[nodeType] = { byId: {} };
  }
  nodeMap[nodeType]["byId"][data.uid] = data;
};

const addToNodeIds = (nodeIds, nodeType, data) => {
  if (!nodeIds[nodeType]) {
    nodeIds[nodeType] = Im.Set();
  }
  nodeIds[nodeType] = nodeIds[nodeType].add(data.uid);
};

export const mapNodes = data => {
  let pathMap = {};
  let nodeMap = {};
  let nodeIds = {};
  for (let item of data) {
    // Skip if we don't have valid node data
    let nodeType = nodeNameMap[item.type] || item.type;
    let data = item.node ? item.node[item.type] : null;
    if (!item.node || !data) {
      continue;
    }

    // Add these nodes to our map and id set
    addToNodeMap(nodeMap, nodeType, data);
    addToNodeIds(nodeIds, nodeType, data);

    // Exctract BaseMetrics from MetricScore objects
    if (nodeType == "metricScores") {
      addToNodeMap(nodeMap, "baseMetrics", data.metric);
    }

    // Map of path to type/ids
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

export const getPtr = (commitId, refId) => {
  // Get the type of pointer we are using
  let ptrId = commitId || refId;
  let ptr = ptrId == commitId ? "commit" : "ref";
  return { ptrId, ptr };
};

export const storeCommitNodes = (state, commitId, nodeData) => {
  let newState = state;
  // Remap the data to a dictionary
  let { pathMap, nodeMap, nodeIds, pathRoot } = mapNodes(nodeData);
  // Set the path root for reference
  newState = newState.setInPath(`commitNodes.${commitId}.pathRoot`, pathRoot);
  // Add the list of node types, uids and paths
  newState = newState.setInPath(`commitNodes.${commitId}.byPath`, pathMap);
  // Set a list of the node Ids by type in this commit
  newState = newState.setInPath(`commitNodes.${commitId}.byType`, nodeIds);
  // Add the list of node types to entities
  newState = newState.update(items => newState.mergeDeepOverwriteLists(items, Im.fromJS(nodeMap)));
  // Return the new state
  return newState;
};

export const updateCommitNodes = (state, commitId, nodeData) => {
  let newState = state;
  // Map the new value as if it were an incoming list
  let { pathMap, nodeMap, nodeIds } = mapNodes(nodeData);
  // Merge in the pathMap
  newState = newState.mergeDeepInPath(`commitNodes.${commitId}.byPath`, pathMap);
  // Set a list of the node Ids by type in this commit
  newState = newState.mergeDeepInPath(`commitNodes.${commitId}.byType`, nodeIds);
  // Add the nodes to the global set
  newState = newState.update(items => newState.mergeDeepOverwriteLists(items, Im.fromJS(nodeMap)));
  // Return the new state
  return newState;
};
