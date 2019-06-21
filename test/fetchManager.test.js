import Traec from "../src";
import React from "react";
import configureStore from "redux-mock-store";

describe("fethcManager", () => {
  xit("should contain a test", () => {
    const middlewares = [];
    const mockStore = configureStore(middlewares);
    const initialState = {};
    store.mockImplementation(mockStore(initialState));

    let fetch = new Traec.Fetch("company", "list");
    fetch.dispatch();
    expect(store.getState().content).toMatchSnapshot();
  });
});

describe("React component with Traec.Fetch", () => {
  it("should contain a test", () => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);

        this.requiredFetches = [new Traec.Fetch("project_reporting_periods", "list")];
      }

      componentDidMount() {
        Traec.fetchRequired.bind(this)();
      }
    }
  });
});
