export const fetchRequired = function(fetches = this.requiredFetches) {
  fetches.map(fetch =>
    fetch.dispatchFromProps(this.props, this.state ? this.state.fetchedUrls : {}, i => {
      return this.setState ? this.setState(i) : null;
    })
  );
};
