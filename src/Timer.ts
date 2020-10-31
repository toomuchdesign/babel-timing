import mergeWith from 'lodash.mergewith';
import { onlyUnique, sortByProperty } from './utils';

type HRTime = ReturnType<NodeJS.HRTime>;

type PluginResult = {
  name: string;
  time: number;
  timePerVisit: number;
  visits: number;
};

type Result = {
  name: string;
  time: number;
  plugins: PluginResult[];
};

export default class Timer {
  _events: {
    [pluginAlias: string]: HRTime[];
  };
  _results: {
    [pluginAlias: string]: {
      time: number;
      visits: number;
    };
  };
  _file: string;
  wrapPluginVisitorMethod: (
    pluginAlias: string,
    visitorType: string,
    callback: {
      apply: Function;
    }
  ) => Function;

  constructor(file: string) {
    this._events = {};
    this._results = {};
    this._file = file;
    this.wrapPluginVisitorMethod = (pluginAlias, visitorType, callback) => {
      const self = this;
      return function(...args: unknown[]) {
        self._push(pluginAlias);
        // @ts-ignore
        callback.apply(this, args);
        self._pop(pluginAlias);
      };
    };
  }

  _push(pluginAlias: string) {
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

  _pop(pluginAlias: string) {
    const start = this._events?.[pluginAlias].shift();
    if (start) {
      const deltaInMS = Timer.getDeltaInMS(start);
      this._results[pluginAlias].time += deltaInMS;
    }
  }

  getResults(): Result {
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

  static getDeltaInMS(start: HRTime): number {
    const delta = process.hrtime(start);
    return delta[0] * 1e3 + delta[1] / 1e6;
  }

  static getTotalTime(results: { time: number }[]): number {
    return results.reduce((total, entry) => total + entry.time, 0);
  }

  // To be used in .map
  static addTimePerVisitProperty<
    Entry extends { time: number; visits: number }
  >(entry: Entry): Entry & { timePerVisit: number } {
    return {
      ...entry,
      timePerVisit: entry.time / entry.visits,
    };
  }

  static mergePluginsProp(...pluginsArrays: PluginResult[]) {
    function mergeStrategy(objValue: string | number, srcValue: number) {
      if (typeof objValue === 'string') {
        return objValue;
      }
      if (typeof objValue === 'number') {
        return objValue + srcValue;
      }
    }
    const results = pluginsArrays.flat();
    return (
      results
        // Get list of plugin names
        .map(entry => entry.name)
        .filter(onlyUnique)
        // Merge data entries with same plugin name
        .map(pluginName => {
          const samePlugin = results.filter(data => data.name === pluginName);
          return mergeWith({}, ...samePlugin, mergeStrategy);
        })
        .map(Timer.addTimePerVisitProperty)
        .sort(sortByProperty('time'))
    );
  }
}
