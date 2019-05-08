# Babel timing

[![Build status][ci-badge]][ci]

Measure **Babel compilation time** file by file, plugin by plugin. [See screenshot](https://raw.githubusercontent.com/toomuchdesign/babel-timing/master/screenshot.png).

Get some insights about Babel transpilation when your application or your tests take ages to build.

**Note:** this tool is in **version 0**, any minor release might introduce breaking changes.

## Installation

Can be installed both as **global** or **local** dependency.

```bash
npm i babel-timing
yarn add babel-timing
```

## Usage

### As standalone library via CLI

```bash
babel-timing path/to/file-1.js path/to/file-2.js
babel-timing path/to/file-*.js
babel-timing path/to/entrypoint.js --follow-imports
```

### As standalone library via Node

```js
const babelTiming = require('babel-timing').babelTiming;
const results = await babelTiming(['path/to/file.js'], options);
```

### As Webpack integration

You can hook `babel-timing` to your **actual Webpack build process** by registering a **loader** and a **plugin**.

`babel-timing` and `babel-loader` have to be installed as local dependencies.

1. Import `babel-timing/webpack/plugin` into your configuration:
```js
const BabelTimingPlugin = require('babel-timing/webpack/plugin');
```

2. Replace `babel-loader` with `babel-timing/webpack/loader`:
```diff
use: [
-  'babel-loader',
+  'babel-timing/webpack/loader',
],
```

3. Add `babel-timing/webpack/plugin` plugin *(accepts `output` and `outputPath` options)*:

```diff
plugins: [
  // ...
+  new BabelTimingPlugin(),
]
```

4. Start your usual Webpack build

## Options

#### `babelConfig` / `--babel-config`

Type: `string | false`<br />
Default: `undefined`

Path to a custom [babel configuration file](https://babeljs.io/docs/en/options#configfile). By default Babel will try to load any existing valid configuration file.

#### `followImports` / `--follow-imports` *(experimental)*

Type: `bool`<br />
Default: `false`

Follow imported files/modules and run `babel-timing` against them.

#### `include` / `--include`
Type: `string[]` *(cli accepts a string containing a comma-separated list)*<br />
Default: `['**']`

Include paths (imported ones also) according to the [provided glob patterns](https://www.npmjs.com/package/glob#glob-primer).

#### `exclude` / `--exclude`
Type: `string[]` *(cli accepts a string containing a comma-separated list)*<br />
Default: `['**/modules/**']`

Exclude paths (imported ones also) according to the [provided glob patterns](https://www.npmjs.com/package/glob#glob-primer).

#### `resolveMainFields` / `--resolve-main-fields`

Type: `string[]` *(cli accepts a string containing a comma-separated list)*<br />
Default: `['browser', 'module', 'main']`

Determine which fields in imported modules's `package.json` are checked.

#### `expandPackages` / `--expand-packages`
Type: `bool`<br />
Default: `false`

Expand results relative to `node_modules` packages file by file.

#### `output` / `--output`

Type: `string`<br />
Default: `"return"` (`"console"` when called via CLI/Webpack)<br />
Options: `"return"`, `"console"`, `"json"`

Make `babel-timing` results available as:

- `"return"` return results' object
- `"console"` render results in console
- `"json"` save results as `babel-timing-results.json`

#### `outputPath` / `--output-path`
Type: `string`<br />
Default: `"./babel-timing-results.json"`

Path of output file in case `output` option is set to `"json"`.

#### `verbose` / `--verbose`
Type: `bool`<br />
Default: `false`

Log warnings.

## How it works

Compile files with **Babel 7** and get **collect compilation info** through [`wrapPluginVisitorMethod`](https://babeljs.io/docs/en/options#wrappluginvisitormethod) Babel config option.

### Results

**Compilation info** are extracted into the following data **structure**:

```typescript
type Results = {
  name: string,
  totalTime: number,
  plugins: {
    plugin: string,
    timePerVisit: number,
    time: number,
    visits: number,
  }[]
}[]
```

## Notes

This tool started as an attempt of measuring the time taken by Babel while running transpiled tests and compiling Webpack applications.

I didn't find a simple way of monitoring Babel while running the aforementioned tools, since I couldn't relate the `wrapPluginVisitorMethod` calls to the file actually being compiled.

Any further idea/contribution to get to a better Babel monitoring solution is welcome.

## Manual tests :)

```bash
node cli.js __fixtures__/file-1.js
node cli.js __fixtures__/file-1.js __fixtures__/file-2.js
node cli.js __fixtures__/*.js
node cli.js __fixtures__/entry.js --follow-imports
```

## Thanks to

- babel-minify’s [timing plugin](https://github.com/babel/minify/blob/babel-minify%400.5.0/scripts/plugin-timing.js)
- Facebook fbt's [timing plugin](https://github.com/facebookincubator/fbt/blob/20d627d6864dbd8cf8f188d84eb32ba324a81332/transform/util/time-plugins.js)
- This Stack Overflow's [question/answers](https://stackoverflow.com/questions/55537633/measure-babel-compilation-performance-per-file-or-module)


## Todo

- Add `csv` output option
- Expose `wrapPluginVisitorMethod`
- Provide a way to consume `babel-timing` from other tools like `jest`, `rollup`, etc..
- Improve `webpack` integration (and use [`babel-loader`'s `customize` option](https://github.com/babel/babel-loader#options))
- Make `followImports` more reliable

[ci-badge]: https://travis-ci.org/toomuchdesign/babel-timing.svg?branch=master
[ci]: https://travis-ci.org/toomuchdesign/babel-timing
