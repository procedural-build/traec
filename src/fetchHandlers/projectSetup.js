import { postProject } from "./project";
import { postTracker } from "./tracker";
import { postRootRef } from "./ref";

/*
HANDLER FOR POSTING A PROJECT AND SETTING IT UP WITH A TRACKER AND 
SOME ROOT BRANCHES
*/

export const postProjectAndSetup = () => {
  /* Handler to create a project and then set it up by adding a tracker
    and a category for conversion factors
    */
  // Create the tree fetch handler
  let { fetchParams, stateParams } = postProject();
  Object.assign(fetchParams, { apiId: "api_project_and_setup_create" });
  // Modify the post to give a random name for the tree
  Object.assign(fetchParams, {
    // Attach a nextHandler to the tree - so that the metricscore is created on successful creation of the tree
    nextHandlers: [
      (data, post, orgpost) => {
        let { fetchParams, stateParams } = postTracker({ projectId: data.uid });
        // Give the tracker a generic name sustainability_tool
        let body = { name: "sustainability_tool" };
        if (orgpost.from_template) {
          Object.assign(body, { from_template: orgpost.from_template });
        }
        Object.assign(fetchParams, {
          body,
          // After creating the tracker, then setup the conversion_factor branch
          nextHandlers: orgpost.from_template
            ? []
            : [
                (data, post, orgpost) => {
                  let { fetchParams, stateParams } = postRootRef({ trackerId: data.uid });
                  Object.assign(fetchParams, { body: { root_tree_name: "conversion_factors" } });
                  return { fetchParams, stateParams };
                }
              ]
        });
        return { fetchParams, stateParams };
      }
    ]
  });
  return { fetchParams, stateParams };
};
