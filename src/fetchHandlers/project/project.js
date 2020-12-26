import Im from "../../immutable";

export const getProjects = () => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/`,
    apiId: "api_project_list",
    requiredParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state;
    // Store abbreviated references (for getFullId utility to find fullId from 8-char uuid)

    if (!data.errors) {
      for (let projectData of data) {
        newState = newState.addToDict(`projects.byId`, projectData, "uid", projectData.uid.substring(0, 8));
        // Add the parent company
        if (projectData.company && !newState.getInPath(`companies.byId.${projectData.company.uid}`)) {
          newState = newState.addToDict(
            `companies.byId`,
            { ...projectData.company, projects: [{ uid: projectData.uid, name: projectData.name }] },
            "uid",
            projectData.company.uid.substring(0, 8)
          );
        }
      }

      newState = newState.addListToDict(`projects.byId`, data);
    } else {
      newState = newState.setInPath(`errors.projects.list`, data.errors.message);
    }
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const postProject = () => {
  const fetchParams = {
    method: "POST",
    url: `/api/project/`,
    apiId: "api_project_create",
    requiredParams: []
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let { formVisPath, formObjPath } = action.stateParams;
    let newState = state.setInPath(formObjPath, data);
    if (!data.errors) {
      newState = newState.addToDict("projects.byId", data);
      // Add the project uid and name to the parent company (if it exists)
      if (data.company) {
        newState = newState.addListToSet(`companies.byId.${data.company.uid}.projects`, [
          Im.fromJS({ uid: data.uid, name: data.name })
        ]);
      }
      newState = newState.setInPath(formVisPath, false);
    }
    return newState;
  };
  return {
    fetchParams,
    stateParams: {
      stateSetFunc,
      formVisPath: `projects.SHOW_FORM`,
      formObjPath: `projects.newItem`
    }
  };
};

export const putProject = ({ projectId }) => {
  let params = postProject();
  Object.assign(params.fetchParams, {
    method: "PUT",
    url: `/api/project/${projectId}/`,
    apiId: "api_project_update",
    requiredParams: ["projectId"]
  });
  Object.assign(params.stateParams, {
    formVisPath: `projects.editById.${projectId}.SHOW_FORM`,
    formObjPath: `projects.editById.${projectId}.newItem`
  });
  return params;
};

export const patchProject = ({ projectId }) => {
  let params = putProject({ projectId });
  Object.assign(params.fetchParams, {
    method: "PATCH",
    apiId: "api_project_partial_update"
  });
  return params;
};

export const getProject = ({ projectId }) => {
  const fetchParams = {
    method: "GET",
    url: `/api/project/${projectId}/`,
    apiId: "api_project_read",
    requiredParams: ["projectId"]
  };
  const stateSetFunc = (state, action) => {
    const data = action.payload;
    let newState = state.addToDict("projects.byId", data, "uid", projectId);
    newState = newState.addToDict(`projects.byId`, data, "uid", projectId.substring(0, 8));
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};

export const deleteProject = ({ projectId }) => {
  const fetchParams = {
    method: "DELETE",
    url: `/api/project/${projectId}/`,
    apiId: "api_project_delete",
    requiredParams: ["projectId"],
    // Deleting a Project can affect so many things that its
    // best to reload the page and all data again
    postSuccessHook: data => {
      location.reload();
    }
  };
  const stateSetFunc = (state, action) => {
    let newState = state;
    return newState;
  };
  return { fetchParams, stateParams: { stateSetFunc } };
};
