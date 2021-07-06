import Im from "../immutable";

export const entityMap = {
  categoryrevset: "revsets",
  tree: "trees",
  document: "documents",
  metricscore: "metricScores",
  categorycommit: "commits"
};

export const getNode = (path, commitNodes) => {
  return commitNodes.getInPath(`byPath.${path}.uid`);
};

export const getNodeType = (path, commitNodes) => {
  let _type = commitNodes.getInPath(`byPath.${path}.type`);
  return entityMap[_type] || _type;
};

export const getNodeFromPath = (state, path, commitNodes, typeName = null) => {
  let id = commitNodes.getInPath(`byPath.${path}.uid`);
  let _typeName = typeName || getNodeType(path, commitNodes);
  let entity = state.getInPath(`entities.${_typeName}.byId.${id}`);
  return entity ? entity.set("_path", path).set("_type", _typeName) : entity;
};

export const getParentNodeFromPath = (state, path, commitNodes, typeName = null) => {
  if (!path.length || path.length <= 7) {
    return null;
  }
  let parentPath = path.substring(0, path.length - 7);
  return getNodeFromPath(state, parentPath, commitNodes, typeName);
};

export const getNodeChildren = (state, sourceNode, commitNodes, typeName) => {
  if (!commitNodes) {
    return Im.List();
  }
  let paths = sourceNode.getInPath(`children.byType.${typeName}`) || Im.Set();

  return paths
    .toList()
    .sort()
    .map(path => getNodeFromPath(state, path, commitNodes, typeName));
};

export const getPathChildren = (state, path, commitNodes, typeName) => {
  if (!commitNodes) {
    return Im.List();
  }
  let node = commitNodes.getInPath(`byPath.${path}`) || Im.Map();
  return getNodeChildren(state, node, commitNodes, typeName);
};
