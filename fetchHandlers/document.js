"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putDocumentObject = exports.postDocument = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var postDocument = function postDocument(_ref) {
  var trackerId = _ref.trackerId,
      refId = _ref.refId,
      commitId = _ref.commitId,
      treeId = _ref.treeId;
  var fetchParams = {
    method: 'POST',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/tree/").concat(treeId, "/document/"),
    apiId: 'api_tracker_ref_tree_document_create',
    requiredParams: ['trackerId', 'refId', 'commitId', 'treeId']
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    var data = action.payload;
    var _action$stateParams = action.stateParams,
        formVisPath = _action$stateParams.formVisPath,
        formObjPath = _action$stateParams.formObjPath;
    var newState = state.setInPath(formObjPath, data);

    if (!data.errors) {
      // Extract a description if it is provided
      var descr = null;

      if (data.description) {
        descr = data.description;
        delete data.description;
      } // Add the document to state


      var commitPath = "commitEdges.byId.".concat(commitId, ".trees.").concat(treeId);
      newState = newState.addToDict('documents.byId', data);
      newState = newState.setInPath(formVisPath, false);
      newState = newState.addListToSets(["".concat(commitPath, ".documents")], [data.uid]);

      if (descr) {
        // Add the description to state 
        var _commitPath = "commitEdges.byId.".concat(commitId, ".documents.").concat(data.uid);

        newState = newState.addToDict('descriptions.byId', descr);
        newState = newState.addListToSets(["".concat(_commitPath, ".descriptions")], [descr.uid]);
      }
    }

    return newState;
  }; //Modify the POST before send to structure it as required for the API  


  Object.assign(fetchParams, {
    preFetchHook: function preFetchHook(body) {
      return {
        name: _crypto["default"].createHash('sha1').update(body.title).digest('hex'),
        description: {
          title: body.title,
          text: body.description
        }
      };
    }
  });
  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc,
      formVisPath: "documents.editById.".concat(treeId, ".SHOW_DOC_FORM"),
      formObjPath: "documents.editById.".concat(treeId, ".newItem")
    }
  };
};

exports.postDocument = postDocument;

var putDocumentObject = function putDocumentObject(_ref2) {
  var trackerId = _ref2.trackerId,
      refId = _ref2.refId,
      commitId = _ref2.commitId,
      documentId = _ref2.documentId;
  var fetchParams = {
    method: 'PUT',
    url: "/api/tracker/".concat(trackerId, "/ref/").concat(refId, "/document/").concat(documentId, "/"),
    apiId: 'api_tracker_ref_document_update',
    requiredParams: ['trackerId', 'refId', 'commitId', 'documentId'],
    headers: {
      'content-type': undefined
    },
    rawBody: true
  };

  var stateSetFunc = function stateSetFunc(state, action) {
    // Successful put returns a DocumentStatusSerializer object
    var data = action.payload;
    var _action$stateParams2 = action.stateParams,
        formVisPath = _action$stateParams2.formVisPath,
        formObjPath = _action$stateParams2.formObjPath;
    var newState = state.setInPath(formObjPath, data);
    var status = data;

    if (!data.errors) {
      // Store the nested current_object separately and refer to only uuid in status
      if (status.current_object) {
        newState = newState.addToDict('docObjects.byId', status.current_object);
        status.current_object = status.current_object.uid;
      } // Store status and link to commitEdge


      newState = newState.addToDict('docStatuses.byId', status);
      newState = newState.setInPath("commitEdges.byId.".concat(commitId, ".documents.").concat(documentId, ".status"), status.uid); // Finally hide the form

      newState = newState.setInPath(formVisPath, false);
    }

    return newState;
  };

  return {
    fetchParams: fetchParams,
    stateParams: {
      stateSetFunc: stateSetFunc
    }
  };
};

exports.putDocumentObject = putDocumentObject;