# Babel timing: further integrations

## Hops

[Hops](https://github.com/xing/hops) integration can be achieved with a single [core mixin](https://github.com/xing/hops#mixins):

```js
// mixin.core.js
const { Mixin } = require('hops');
const BabelTimingPlugin = require('babel-timing/dist/webpack/plugin');

class BabelTimingMixin extends Mixin {
  configureBuild(webpackConfig, loaderConfigs, target) {
    if (target === 'build') {
      loaderConfigs.jsLoaderConfig.options.customize = require.resolve(
        'babel-timing/dist/webpack/babel-loader-customize'
      );
      webpackConfig.plugins.push(new BabelTimingPlugin());
    }
  }
}

module.exports = BabelTimingMixin;
```

1. Delete `babel-loader` cache at `./node_modules/.cache/babel-loader/`
2. Start Hops bundling process with `hops build`
