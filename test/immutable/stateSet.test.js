import Im from "../../src/immutable";

describe("addListToDict", () => {
  it("should add list to empty state", () => {
    let state = Im.Map();
    let expectedResult = Im.fromJS({
      entities: { projects: { byId: { project1: { uid: "project1", some: "thing" } } } }
    });
    let result = state.addListToDict("entities.projects.byId", [{ uid: "project1", some: "thing" }]);

    expect(expectedResult).toEqual(result);
  });

  it("should add onto existing state", () => {
    let state = Im.fromJS({
      entities: { projects: { byId: { project1: { uid: "project1", some: "thing" } } } }
    });
    let expectedResult = Im.fromJS({
      entities: {
        projects: {
          byId: { project1: { uid: "project1", some: "thing" }, project2: { uid: "project2", some: "otherthing" } }
        }
      }
    });
    let result = state.addListToDict("entities.projects.byId", [{ uid: "project2", some: "otherthing" }]);
    expect(expectedResult).toEqual(result);
  });

  it("should merge existing state", () => {
    let state = Im.fromJS({
      entities: { projects: { byId: { project1: { uid: "project1", some: "thing", key: "value" } } } }
    });
    let expectedResult = Im.fromJS({
      entities: {
        projects: {
          byId: {
            project1: { uid: "project1", some: "thing", key: "value" },
            project2: { uid: "project2", some: "otherthing" }
          }
        }
      }
    });
    let result = state.addListToDict("entities.projects.byId", [
      { uid: "project1", some: "thing" },
      { uid: "project2", some: "otherthing" }
    ]);
    expect(expectedResult).toEqual(result);
  });
});
