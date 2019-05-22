"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRequired = void 0;

var fetchRequired = function fetchRequired() {
  var _this = this;

  this.requiredFetches.map(function (fetch) {
    return fetch.dispatchFromProps(_this.props, _this.state ? _this.state.fetchedUrls : {}, function (i) {
      return _this.setState(i);
    });
  });
};

exports.fetchRequired = fetchRequired;