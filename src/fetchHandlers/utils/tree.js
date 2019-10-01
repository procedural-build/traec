import Im from "../../immutable";

export const getTreeStructure = (state, commitId, treeId) => {
  let tree = state.getInPath(`commitEdges.byId.${commitId}.trees.${treeId}`);
  let subTrees = tree.get("trees");
  if (subTrees) {
    return [treeId, subTrees.map(subTreeId => getTreeStructure(state, commitId, subTreeId)).toJS()];
  } else {
    return treeId;
  }
};

export const cleanTreeStructureFunction = (state, commitId, treeId) => {
  let toRemove = Im.fromJS(getTreeStructure(state, commitId, treeId));
  let newState = state;

  for (let tree of toRemove.flatten()) {
    newState = newState.removeInPath(`commitEdges.byId.${commitId}.trees.${tree}`);
  }

  return newState;
};
