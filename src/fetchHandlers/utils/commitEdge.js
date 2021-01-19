import { storeCommitBranch, reduceCommitBranch } from "./commitBranch";

export const edgeDictToState = (newState, commitId, data) => {
  // Unpack the data into the state tree
  for (let key in data) {
    // Get the function for storing edges
    let edgeSetFunc = edgeSetFunctions[key];
    // Continue if we don't have a function to handle this edge
    if (!edgeSetFunc) {
      //console.log(`Skipping handling of edge type: ${key}`)
      continue;
    }
    // Add them to the store
    for (let edge of data[key]) {
      //console.log("Setting edge ", edge)
      newState = edgeSetFunc(commitId, edge, newState);
      //console.log("DONE setting edge")
    }
  }
  return newState;
};

const edgeSetFunctions = {
  treetree: (commitId, edge, newState) => {
    let { parent, child } = edge;
    newState = newState.addToDict("trees.byId", child);
    if (parent) {
      newState = newState.addListToSets([`commitEdges.byId.${commitId}.trees.${parent.uid}.trees`], [child.uid]);
      newState = newState.setInPath(`commitEdges.byId.${commitId}.trees.${child.uid}.parent`, parent.uid);
    }
    return newState;
  },
  treedocument: (commitId, edge, newState) => {
    let { tree, document } = edge;
    newState = newState.addToDict("documents.byId", document);
    newState = newState.addListToSets([`commitEdges.byId.${commitId}.trees.${tree.uid}.documents`], [document.uid]);
    newState = newState.setInPath(`commitEdges.byId.${commitId}.documents.${document.uid}.parent`, tree.uid);
    return newState;
  },
  treecategory: (commitId, edge, newState) => {
    let { tree, commitBranch } = edge;
    if (!commitBranch) {
      return newState;
    }
    newState = storeCommitBranch(newState, commitBranch);
    newState = newState.setInPath(
      `commitEdges.byId.${commitId}.trees.${tree.uid}.categories.${commitBranch.uid}`,
      reduceCommitBranch(commitBranch)
    );
    return newState;
  },
  treescore: (commitId, edge, newState) => {
    let { tree, score } = edge;
    let baseMetric = score.metric;
    //score.metric = baseMetric.uid;
    newState = newState.addToDict("metricScores.byId", score);
    newState = newState.addToDict("baseMetrics.byId", baseMetric);
    newState = newState.addListToSets([`commitEdges.byId.${commitId}.trees.${tree.uid}.metricScores`], [score.uid]);
    return newState;
  },
  treedescription: (commitId, edge, newState) => {
    let { tree, description } = edge;
    newState = newState.addToDict("descriptions.byId", description);
    newState = newState.addListToSets(
      [`commitEdges.byId.${commitId}.trees.${tree.uid}.descriptions`],
      [description.uid]
    );
    return newState;
  },
  documentdescription: (commitId, edge, newState) => {
    let { document, description } = edge;
    newState = newState.addToDict("descriptions.byId", description);
    newState = newState.addListToSets(
      [`commitEdges.byId.${commitId}.documents.${document.uid}.descriptions`],
      [description.uid]
    );
    return newState;
  },
  documentstatus: (commitId, edge, newState) => {
    let { document, status } = edge;
    // Store the nested current_object separately and refer to only uuid in status
    if (status.current_object) {
      newState = newState.addToDict("docObjects.byId", status.current_object);
      status.current_object = status.current_object.uid;
    }
    // Store status and link to commitEdge
    newState = newState.addToDict("docStatuses.byId", status);
    newState = newState.setInPath(`commitEdges.byId.${commitId}.documents.${document.uid}.status`, status.uid);
    return newState;
  },
  documentscore: (commitId, edge, newState) => {
    let { document, score } = edge;
    newState = newState.addToDict("score.byId", score);
    newState = newState.addListToSets([`commitEdges.byId.${commitId}.documents.${document.uid}.scores`], [score.uid]);
    return newState;
  },
  treetrackercomment: (commitId, edge, newState) => {
    let { tree, trackercomment } = edge;
    newState = newState.addToDict("comments.byId", trackercomment);
    newState = newState.addListToSets(
      [`commitEdges.byId.${commitId}.trees.${tree.uid}.comments`],
      [trackercomment.uid]
    );
    return newState;
  },
};
