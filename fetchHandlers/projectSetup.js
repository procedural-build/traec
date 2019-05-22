"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postProjectAndSetup = void 0;

var _project = require("./project");

var _tracker = require("./tracker");

var _ref = require("./ref");

/*
HANDLER FOR POSTING A PROJECT AND SETTING IT UP WITH A TRACKER AND 
SOME ROOT BRANCHES
*/
var postProjectAndSetup = function postProjectAndSetup() {
  /* Handler to create a project and then set it up by adding a tracker
  and a category for conversion factors
  */
  // Create the tree fetch handler
  var _postProject = (0, _project.postProject)(),
      fetchParams = _postProject.fetchParams,
      stateParams = _postProject.stateParams;

  Object.assign(fetchParams, {
    apiId: 'api_project_and_setup_create'
  }); // Modify the post to give a random name for the tree

  Object.assign(fetchParams, {
    // Attach a nextHandler to the tree - so that the metricscore is created on successful creation of the tree
    nextHandlers: [function (data, post, orgpost) {
      var _postTracker = (0, _tracker.postTracker)({
        projectId: data.uid
      }),
          fetchParams = _postTracker.fetchParams,
          stateParams = _postTracker.stateParams; // Give the tracker a generic name sustainability_tool


      var body = {
        name: "sustainability_tool"
      };

      if (orgpost.from_template) {
        Object.assign(body, {
          from_template: orgpost.from_template
        });
      }

      Object.assign(fetchParams, {
        body: body,
        // After creating the tracker, then setup the conversion_factor branch
        nextHandlers: orgpost.from_template ? [] : [function (data, post, orgpost) {
          var _postRootRef = (0, _ref.postRootRef)({
            trackerId: data.uid
          }),
              fetchParams = _postRootRef.fetchParams,
              stateParams = _postRootRef.stateParams;

          Object.assign(fetchParams, {
            body: {
              'root_tree_name': 'conversion_factors'
            }
          });
          return {
            fetchParams: fetchParams,
            stateParams: stateParams
          };
        }]
      });
      return {
        fetchParams: fetchParams,
        stateParams: stateParams
      };
    }]
  });
  return {
    fetchParams: fetchParams,
    stateParams: stateParams
  };
};

exports.postProjectAndSetup = postProjectAndSetup;