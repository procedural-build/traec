export const fetchRequired = function (fetches = this.requiredFetches) {
  fetches
    .filter((fetch) => fetch)
    .map((fetch) =>
      fetch.dispatchFromProps(this.props, this.state ? this.state.fetchedUrls : {}, (i) =>
        this.setState ? this.setState(i) : null
      )
    );
};
