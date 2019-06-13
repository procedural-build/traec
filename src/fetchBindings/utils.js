export const fetchRequired = function(fetches = this.requiredFetches) {
  fetches.map(fetch =>
    fetch.dispatchFromProps(this.props, this.state ? this.state.fetchedUrls : {}, i => this.setState(i))
  );
};
