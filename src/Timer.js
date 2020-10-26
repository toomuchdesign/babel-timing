const mergeWith = require('lodash.mergewith');
const flatten = require('reduce-flatten');
const {onlyUnique, sortByProperty} = require('./utils.ts');

// type Results = {
//   name: string,
//   time: number,
//   plugins: {
//     name: string,
//     time: number,
//     timePerVisit: number,
//     visits: number,
//   }[]
// }[]

class Timer {
  constructor(file) {
    this._events = {};
    this._results = {};
    this._file = file;
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
    const deltaInMS = Timer.getDeltaInMS(start);
    this._results[pluginAlias].time += deltaInMS;
  }

  getResults() {
    const plugins = Object.keys(this._results)
      .map(pluginAlias => {
        const entry = this._results[pluginAlias];
        return {
          name: pluginAlias,
          ...entry,
        };
      })
      .map(Timer.addTimePerVisitProperty)
      .sort(sortByProperty('time'));

    return {
      name: this._file,
      time: Timer.getTotalTime(plugins),
      plugins,
    };
  }

  static getDeltaInMS(start) {
    const delta = process.hrtime(start);
    return delta[0] * 1e3 + delta[1] / 1e6;
  }

  static getTotalTime(results) {
    return results.reduce((total, entry) => total + entry.time, 0);
  }

  // To be used in .map
  static addTimePerVisitProperty(entry) {
    return {
      ...entry,
      timePerVisit: entry.time / entry.visits,
    };
  }

  static mergePluginsProp(...pluginsArrays) {
    function mergeStrategy(objValue, srcValue) {
      if (typeof objValue === 'string') {
        return objValue;
      }
      if (typeof objValue === 'number') {
        return objValue + srcValue;
      }
    }

    const results = pluginsArrays.reduce(flatten, []);
    return (
      results
        // Get list of plugin names
        .map(entry => entry.name)
        .filter(onlyUnique)
        // Merge data entries with same plugin name
        .map(pluginName => {
          const samePlugin = results.filter(data => data.name === pluginName);
          return mergeWith(...samePlugin, mergeStrategy);
        })
        .map(Timer.addTimePerVisitProperty)
        .sort(sortByProperty('time'))
    );
  }
}

module.exports = Timer;
