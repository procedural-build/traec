import Traec from "traec";
import Crypto from "crypto";

export function addCategoryRef({ trackerId, refId, commitId, treeId }) {
  let fetch = new Traec.Fetch("tracker_ref_tree_branch", "post", {
    trackerId,
    refId,
    commitId,
    treeId
  });
  fetch.updateFetchParams({
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
  return fetch;
}

export function addTree({ refId, trackerId, treeId, commitId }) {
  let fetch = new Traec.Fetch("tracker_ref_tree_tree", "post", {
    trackerId,
    refId,
    commitId,
    treeId
  });
  fetch.updateFetchParams({
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
  return fetch;
}

export function addDocument({ trackerId, refId, commitId, treeId }) {
  let fetch = new Traec.Fetch("tracker_ref_tree_document", "post", {
    trackerId,
    refId,
    commitId,
    treeId
  });
  return fetch;
}

export function editTree({ refId, trackerId, treeId, commitId }) {
  let fetch = new Traec.Fetch("tracker_ref_tree", "put", {
    trackerId,
    refId,
    commitId,
    treeId
  });
  return fetch;
}

export function deleteTree(e) {
  e.preventDefault();
  confirmDelete({
    text: `This will delete this tree including any data contained within.  Are you sure you would like to proceed?`,
    onConfirm: () => {
      new Traec.Fetch("tracker_ref_tree", "delete", { ...this.getUrlParams() }).dispatch();
    }
  });
}
