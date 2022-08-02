export const postDocument = ({ trackerId, refId, commitId, treeId }) => {
  const fetchParams = {
    method: "POST",
    url: `/api/tracker/${trackerId}/ref/${refId}/tree/${treeId}/document/`,
    apiId: "api_tracker_ref_tree_document_create",
    requiredParams: ["trackerId", "refId", "commitId", "treeId"],
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
    preFetchHook: (body) => {
      return {
        name: crypto.createHash("sha1").update(body.title).digest("hex"),
        description: {
          title: body.title,
          text: body.description,
        },
      };
    },
  });
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `documents.editById.${treeId}.SHOW_DOC_FORM`,
      formObjPath: `documents.editById.${treeId}.newItem`,
    },
  };
};

export const getDocumentObjects = ({ trackerId, commitId, docId, thisCommitOnly = null, path = null }) => {
  let queryParams = { thisCommitOnly, path };
  let queryString = new URLSearchParams(queryParams).toString();
  queryString = queryString ? `?${queryString}` : "";

  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${docId}/object/${queryString}`,
    apiId: "api_tracker_commit_document_object_list",
    requiredParams: ["trackerId", "commitId", "docId"],
    queryParams: { thisCommitOnly: null, path: null },
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
    let pathStr = path ? `.${path}` : null;
    newState = newState.addListToSet(`commitEdges.byId.${commitId}.documents.${docId}${pathStr}.objects`, objectIds);
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
    queryParams: { signedURL: false },
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

export const deleteDocumentObject = ({ trackerId, commitId, docId, docObjectId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${docId}/object/${docObjectId}/`,
    apiId: "api_tracker_commit_document_object_delete",
    requiredParams: ["trackerId", "commitId", "docId", "docObjectId"],
    queryParams: {},
  };
  const stateSetFunc = (state, action) => {
    return state.deleteIn([`docObjects`, `byId`, `${docObjectId}`]);
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
      treeId,
    })}`,
    apiId: "api_tracker_ref_document_update",
    requiredParams: ["trackerId", "refId", "commitId", "documentId"],
    queryParams: { allow_commit_change: false, treeId: null },
    headers: { "content-type": null },
    rawBody: true,
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
          description.uid,
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
      formObjPath: `documents.editById.${documentId}.editDescription`,
    },
  };
};

export const putDocumentObjectCommit = ({ trackerId, commitId, documentId, allow_commit_change, treeId }) => {
  let { fetchParams, stateParams } = putDocumentObject({
    trackerId,
    refId: null,
    commitId,
    documentId,
    allow_commit_change,
    treeId,
  });
  Object.assign(fetchParams, {
    url: `/api/tracker/${trackerId}/commit/${commitId}/document/${documentId}/${getDocQueryParams({
      allow_commit_change,
      treeId,
    })}`,
    apiId: "api_tracker_commit_document_update",
    requiredParams: ["trackerId", "commitId", "documentId"],
  });
  return { fetchParams, stateParams };
};

export const deleteDocument = ({ trackerId, refId, commitId, docId, treeId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/ref/${refId}/document/${docId}/`,
    apiId: "api_tracker_ref_document_delete",
    requiredParams: ["trackerId", "refId", "commitId", "docId"],
  };

  return {
    fetchParams,
    stateParams: { stateSetFunc: (state) => deleteDocumentFromState(state, treeId, commitId, docId) },
  };
};

export const deleteTreeDocument = ({ trackerId, treeId, commitId, docId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/tracker/${trackerId}/commit/${commitId}/tree/${treeId}/document/${docId}/`,
    apiId: "api_tracker_commit_tree_document_delete",
    requiredParams: ["trackerId", "treeId", "commitId", "docId"],
  };

  return {
    fetchParams,
    stateParams: { stateSetFunc: (state) => deleteDocumentFromState(state, treeId, commitId, docId) },
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
    newState = newState.updateIn(`commitEdges.byId.${commitId}.trees.${parentId}.trees`.split("."), (i) =>
      i ? i.delete(docId) : null
    );
  }
  return newState;
};

export const getDisciplineDocuments = ({ trackerId, userId = null, all_disciplines = false }) => {
  let query_params = all_disciplines ? "?all_disciplines=true" : "";
  const fetchParams = {
    method: "GET",
    url: `/api/tracker/${trackerId}/documents/${query_params}`,
    apiId: "api_tracker_documents_list",
    requiredParams: ["trackerId"],
    queryParams: { all_disciplines: false },
  };
  const stateSetFunc = (state, action) => {
    // Successful put returns a DocumentStatusSerializer object
    let data = action.payload;
    let newState = state;
    for (let item of data) {
      if (!item) {
        continue;
      }

      // Store the nested current_object separately and refer to only uuid in status
      newState = newState.addToDict(
        `user.documents.${trackerId}.${userId || "master"}`,
        {
          ...item,
          status: item.status?.uid,
          description: item.description?.uid,
          _commit: item.commit_id,
          _path: item.path,
        },
        "_path"
      ); // Note: documents are indexed by path (to avoid confict if the same node is used elsewhere in commit)

      // Flatten and store the description
      if (item.description) {
        newState = newState.addToDict("descriptions.byId", item.description);
      }

      // Flatten and store the nested status
      if (item.status) {
        newState = newState.addToDict("docStatuses.byId", {
          ...item.status,
          current_object: item.status.current_object?.uid,
        });
        if (item.status.current_object) {
          newState = newState.addToDict("docObjects.byId", item.status.current_object);
        }
      }
    }

    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
