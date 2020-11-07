import mergeWith from 'lodash.mergewith';
import { onlyUnique, sortByProperty } from './utils';
import { TransformOptions } from '@babel/core';
import { ResultByFile, Visit } from './types';

type HRTime = ReturnType<NodeJS.HRTime>;

export default class Timer {
  private _events: {
    [pluginAlias: string]: HRTime[];
  };
  private _results: {
    [pluginAlias: string]: {
      time: number;
      visits: number;
    };
  };
  private _file: string;
  wrapPluginVisitorMethod: TransformOptions['wrapPluginVisitorMethod'];

  constructor(file: string) {
    this._events = {};
    this._results = {};
    this._file = file;
    this.wrapPluginVisitorMethod = (pluginAlias, visitorType, callback) => {
      const self = this;
      return function (...args: unknown[]) {
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

  getResults(): ResultByFile {
    const plugins = Object.keys(this._results)
      .map((pluginAlias) => {
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

  static mergeVisits(...visitArray: Visit[]): Visit[] {
    type VisitKeys = keyof Visit;
    type VisitValues = Visit[VisitKeys];
    function mergeStrategy(objValue: VisitValues, srcValue: VisitValues) {
      if (typeof objValue === 'number' && typeof srcValue === 'number') {
        return objValue + srcValue;
      }
      return objValue;
    }
    const results = visitArray.flat();
    return (
      results
        // Get list of plugin names
        .map((entry) => entry.name)
        .filter(onlyUnique)
        // Merge data entries with same plugin name
        .map((pluginName) => {
          const samePlugin = results.filter((data) => data.name === pluginName);
          return mergeWith({}, ...samePlugin, mergeStrategy);
        })
        .map(Timer.addTimePerVisitProperty)
        .sort(sortByProperty('time'))
    );
  }
}
