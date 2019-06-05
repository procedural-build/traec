import Crypto from "crypto";

export const postDocument = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/document/`,
    apiId: "api_tracker_ref_tree_document_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      // Extract a description if it is provided
      let descr = null;
      if (data.description) {
        descr = data.description;
        delete data.description;
      }
      // Add the document to state
      const commitPath = `commitEdges.byId.${commitId}.trees.${treeId}`;
      newState = newState.addToDict("documents.byId", data);
      newState = newState.setInPath(formVisPath, false);
      newState = newState.addListToSets([`${commitPath}.documents`], [data.uid]);
      if (descr) {
        // Add the description to state
        const commitPath = `commitEdges.byId.${commitId}.documents.${data.uid}`;
        newState = newState.addToDict("descriptions.byId", descr);
        newState = newState.addListToSets([`${commitPath}.descriptions`], [descr.uid]);
      }
    }
    return newState;
  };
  //Modify the POST before send to structure it as required for the API
  Object.assign(fetchParams, {
    preFetchHook: body => {
      return {
        name: Crypto.createHash("sha1")
          .update(body.title)
          .digest("hex"),
        description: {
          title: body.title,
          text: body.description
        }
      };
    }
  });
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `documents.editById.${treeId}.SHOW_DOC_FORM`,
      formObjPath: `documents.editById.${treeId}.newItem`
    }
  };
};

export const getDocumentObjects = ({ trackerId, refId, commitId, documentId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${documentId}/object/`,
    apiId: "api_tracker_commit_document_object_list",
    requiredParams: ["trackerId", "refId", "commitId", "documentId"]
  };
  const stateSetFunc = (state, action) => {
    // Successful put returns a DocumentStatusSerializer object
    let data = action.payload;
    let newState = state;
    let objectIds = [];
    for (let item of data) {
      // Store the nested current_object separately and refer to only uuid in status
      newState = newState.addToDict("docObjects.byId", item);
      objectIds.push(item.uid);
    }
    // Set the list of objects
    newState = newState.addListToSet(`commitEdges.byId.${commitId}.documents.${documentId}.objects`, objectIds);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const putDocumentObject = ({ trackerId, refId, commitId, documentId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/ref/${refId}/document/${documentId}/`,
    apiId: "api_tracker_ref_document_update",
    requiredParams: ["trackerId", "refId", "commitId", "documentId"],
    headers: { "content-type": undefined },
    rawBody: true
  };
  const stateSetFunc = (state, action) => {
    // Successful put returns a DocumentStatusSerializer object
    let data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    let status = data;
    if (!data.errors) {
      // Store the nested current_object separately and refer to only uuid in status
      if (status.current_object) {
        newState = newState.addToDict("docObjects.byId", status.current_object);
        status.current_object = status.current_object.uid;
      }
      // Store status and link to commitEdge
      newState = newState.addToDict("docStatuses.byId", status);
      newState = newState.setInPath(`commitEdges.byId.${commitId}.documents.${documentId}.status`, status.uid);
      // Finally hide the form
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
