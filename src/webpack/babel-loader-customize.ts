import { timersCollection } from '../index';
import { PartialConfig } from '@babel/core';

// https://github.com/babel/babel-loader#customized-loader
export default function babelLoaderCustomize() {
  return {
    config(cfg: PartialConfig) {
      const { filename } = cfg.options;
      if (filename) {
        const timer = timersCollection.getTimer(filename);
        return {
          ...cfg.options,
          wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
        };
      }
      return cfg;
    },
  };
}
