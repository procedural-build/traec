export const fetchRequired = function() {
  this.requiredFetches.map(fetch =>
    fetch.dispatchFromProps(
      this.props,
      this.state ? this.state.fetchedUrls : {},
      i => this.setState(i)
    )
  );
};
