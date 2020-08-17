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

export const getDocumentObjects = ({ trackerId, commitId, docId, thisCommitOnly = null }) => {
  let queryParams = thisCommitOnly ? `?thisCommitOnly=true` : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${docId}/object/${queryParams}`,
    apiId: "api_tracker_commit_document_object_list",
    requiredParams: ["trackerId", "commitId", "docId"],
    queryParams: { thisCommitOnly: null }
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
    newState = newState.addListToSet(`commitEdges.byId.${commitId}.documents.${docId}.objects`, objectIds);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const getDocumentObject = ({ trackerId, commitId, docId, docObjectId, signedURL = false }) => {
  let queryParams = signedURL ? "?url=true" : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${docId}/object/${docObjectId}/${queryParams}`,
    apiId: "api_tracker_commit_document_object_retrieve",
    requiredParams: ["trackerId", "commitId", "docId", "docObjectId"],
    queryParams: { signedURL: false }
  };
  const stateSetFunc = (state, action) => {
    // Successful put returns a DocumentStatusSerializer object
    let data = action.payload;
    let newState = state;
    newState = newState.addToDict("docObjects.byId", data);
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

const getDocQueryParams = ({ allow_commit_change, treeId }) => {
  let query_params = [];
  if (allow_commit_change) {
    query_params.push("allow_commit_change=true");
  }
  if (treeId) {
    query_params.push(`treeId=${treeId}`);
  }
  let query_string = query_params.join("&");
  return query_string ? "?" + query_string : "";
};

export const putDocumentObject = ({ trackerId, refId, commitId, documentId, allow_commit_change, treeId }) => {
  const fetchParams = {
    method: "PUT",
    url: `/api/tracker/${trackerId}/ref/${refId}/document/${documentId}/${getDocQueryParams({
      allow_commit_change,
      treeId
    })}`,
    apiId: "api_tracker_ref_document_update",
    requiredParams: ["trackerId", "refId", "commitId", "documentId"],
    queryParams: { allow_commit_change: false, treeId: null },
    headers: { "content-type": null },
    rawBody: true
  };
  const stateSetFunc = (state, action) => {
    // Successful put returns a DocumentStatusSerializer object
    let data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    let { status, description } = data;
    if (!data.errors) {
      if (status) {
        // Store the nested current_object separately and refer to only uuid in status
        if (status.current_object) {
          newState = newState.addToDict("docObjects.byId", status.current_object);
          status.current_object = status.current_object.uid;
        }
        // Store status and link to commitEdge
        newState = newState.addToDict("docStatuses.byId", status);
        newState = newState.setInPath(`commitEdges.byId.${commitId}.documents.${documentId}.status`, status.uid);
      }
      if (description) {
        newState = newState.addToDict("descriptions.byId", description);
        newState = newState.addListToSet(`commitEdges.byId.${commitId}.documents.${documentId}.descriptions`, [
          description.uid
        ]);
      }
      // Finally hide the form
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `documents.editById.${documentId}.SHOW_EDIT_DESCRIPTION_FORM`,
      formObjPath: `documents.editById.${documentId}.editDescription`
    }
  };
};

export const putDocumentObjectCommit = ({ trackerId, commitId, documentId, allow_commit_change, treeId }) => {
  let { fetchParams, stateParams } = putDocumentObject({
    trackerId,
    refId: null,
    commitId,
    documentId,
    allow_commit_change,
    treeId
  });
  Object.assign(fetchParams, {
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${documentId}/${getDocQueryParams({
      allow_commit_change,
      treeId
    })}`,
    apiId: "api_tracker_commit_document_update",
    requiredParams: ["trackerId", "commitId", "documentId"]
  });
  return { fetchParams, stateParams };
};

export const deleteDocument = ({ trackerId, refId, commitId, docId, treeId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/ref/${refId}/document/${docId}/`,
    apiId: "api_tracker_ref_document_delete",
    requiredParams: ["trackerId", "refId", "commitId", "docId"]
  };

  return {
    fetchParams,
    stateParams: { stateSetFunc: state => deleteDocumentFromState(state, treeId, commitId, docId) }
  };
};

export const deleteTreeDocument = ({ trackerId, treeId, commitId, docId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/document/${docId}/`,
    apiId: "api_tracker_commit_tree_document_delete",
    requiredParams: ["trackerId", "treeId", "commitId", "docId"]
  };

  return {
    fetchParams,
    stateParams: { stateSetFunc: state => deleteDocumentFromState(state, treeId, commitId, docId) }
  };
};

const deleteDocumentFromState = (state, treeId, commitId, docId) => {
  let parentId = state.getInPath(`commitEdges.byId.${commitId}.documents.${docId}.parent`);
  let newState = state;
  let descriptions = newState.getInPath(`commitEdges.byId.${commitId}.documents.${docId}.descriptions`);

  // Remove all descriptions of the document:
  if (descriptions) {
    for (let descriptionId of descriptions.toJS()) {
      newState = newState.removeInPath(`descriptions.byId.${descriptionId}`);
      newState = newState.removeInPath(`commitEdges.byId.${commitId}.tree.${treeId}.descriptions.${descriptionId}`);
    }
  }
  newState = newState.removeInPath(`commitEdges.byId.${commitId}.documents.${docId}`);
  newState = newState.removeInPath(`user.documents.byId.${docId}`);
  newState = newState.removeInPath(`commitEdges.byId.${commitId}.trees.${treeId}.documents.${docId}`);

  newState = newState.removeInPath(`documents.byId.${docId}`);
  if (parentId) {
    newState = newState.updateIn(`commitEdges.byId.${commitId}.trees.${parentId}.trees`.split("."), i =>
      i ? i.delete(docId) : null
    );
  }
  return newState;
};

export const getDisciplineDocuments = ({ trackerId, all_disciplines = false }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/documents/${all_disciplines ? "?all_disciplines=true" : ""}`,
    apiId: "api_tracker_documents_list",
    requiredParams: ["trackerId"],
    queryParams: { all_disciplines: false }
  };
  const stateSetFunc = (state, action) => {
    // Successful put returns a DocumentStatusSerializer object
    let data = action.payload;
    let newState = state;
    let trackerId = action.fetchParams.url.split("/")[3];
    for (let item of data) {
      if (item) {
        let statusId = item.status ? item.status.uid : null;
        let descriptionId = item.description ? item.description.uid : null;
        let refId = item.cref ? item.cref.uid : null;
        let document = { uid: item.uid, status: statusId, description: descriptionId, trackerId, refId: refId };

        // Store the nested current_object separately and refer to only uuid in status
        newState = newState.addToDict("user.documents.byId", document);
        if (descriptionId) newState = newState.addToDict("descriptions.byId", item.description);

        if (statusId) {
          let current_object_id = item.status.current_object ? item.status.current_object.uid : null;
          let status = { ...item.status, current_object: current_object_id };
          newState = newState.addToDict("docStatuses.byId", status);
          if (current_object_id) {
            newState = newState.addToDict("docObjects.byId", item.status.current_object);
          }
        }
        if (refId) {
          newState = newState.addToDict("refs.byId", item.cref);
        }
      }
    }

    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
