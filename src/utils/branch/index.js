/*
Utility functions to step through the Redux state and retrieve branches and linkages
of a particular commit 
*/

/*
Recursively get the commits from commitBranch objects
*/
const getCommits = (state, rootCommitId) => {
  let commitSet = new Set([rootCommitId]);

  let branchMap = state.getInPath(`entities.commitBranches.commit.${rootCommitId}.branch`) || Traec.Im.Map();
  for (let [branchId, branch] of branchMap.entries()) {
    let commitBranchMap = branch.getInPath(`byId`);
    for (let [commitBranchId, commitBranch] of commitBranchMap.entries()) {
      // Get the target commit
      let targetCommitId = commitBranch.getInPath("target.commit");
      if (!targetCommitId) {
        let refId = commitBranch.getInPath("target.ref");
        targetCommitId = state.getInPath(`entities.refs.byId.${refId}.latest_commit.uid`);
      }
      commitSet.add(targetCommitId);

      // Get the child commits from here (recursive)
      let subCommitSet = getCommits(state, targetCommitId);
      commitSet = new Set([...subCommitSet, ...commitSet]);
    }
  }
  return commitSet;
};

/*
  Get all of the siblings (revisions) refs given a rootCommitId and parentCommitId
  */

const gitRevisionRefs = (state, rootCommitId, parentCommitId = null) => {
  let parentPath = parentCommitId ? `commit.${parentCommitId}` : "root";
  let siblingBranches = state.getInPath(`entities.commitBranches.${parentPath}.branch.${rootCommitId}.byId`);
  return siblingBranches
    .toList()
    .map(commitBranch => state.getInPath(`entities.refs.byId.${commitBranch.getInPath("target.ref")}`));
};
