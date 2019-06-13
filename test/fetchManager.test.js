import Traec from "../src";
import React from "react";

describe("fethcManager", () => {
  it("should contain a test", () => {
    const spyedFetch = spyOn(Traec, "Fetch");
    const fetches = [new Traec.Fetch("project_reporting_periods", "list")];
    Traec.fetchRequired(fetches);
    expect(spyedFetch).toBeCalledTimes(3);
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
