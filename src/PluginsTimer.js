class PluginsTimer {
  constructor() {
    this._events = {};
    this._results = {};
    this.wrapPluginVisitorMethod = (pluginAlias, visitorType, callback) => {
      const self = this;
      return function(...args) {
        self._push(pluginAlias);
        callback.apply(this, args);
        self._pop(pluginAlias);
      };
    };
  }

  _push(pluginAlias) {
    if (this._events[pluginAlias] === undefined) {
      this._events[pluginAlias] = [];
      this._results[pluginAlias] = {
        time: 0,
        visits: 0,
      };
    }

    this._events[pluginAlias].push(process.hrtime());
    this._results[pluginAlias].visits += 1;
  }

  _pop(pluginAlias) {
    if (!this._events[pluginAlias] || !this._events[pluginAlias].length) {
      return;
    }

    const start = this._events[pluginAlias].shift();
    const deltaInMS = PluginsTimer.getDeltaInMS(start);
    this._results[pluginAlias].time += deltaInMS;
  }

  getResults() {
    return this._results;
  }

  static getDeltaInMS(start) {
    const delta = process.hrtime(start);
    return delta[0] * 1e3 + delta[1] / 1e6;
  }
}

module.exports = PluginsTimer;
