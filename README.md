# Babel timing

[![Build status][ci-badge]][ci]

Measure **Babel compilation time** [file by file](https://raw.githubusercontent.com/toomuchdesign/babel-timing/master/screenshot-01.png), [plugin by plugin](https://raw.githubusercontent.com/toomuchdesign/babel-timing/master/screenshot-02.png).

Get Babel transpilation insights when your application or your tests take ages to build.

**Note:** this tool is in **version 0**, any minor release might introduce breaking changes.

## Installation

```bash
npm i babel-timing -D
yarn add babel-timing -D
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

Monitor Babel while used by the **actual Webpack bundling process**.

1. Import `babel-timing/webpack/plugin` to Webpack configuration:

```js
const BabelTimingPlugin = require('babel-timing/webpack/plugin');
```

2. Add `customize` option to the existing [`babel-loader`](https://github.com/babel/babel-loader#options) configuration:

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      use: {
        loader: 'babel-loader',
          options: {
            customize: require.resolve('babel-timing/webpack/babel-loader-customize')
         },
      }
    }
  ]
}
```

3. Add `babel-timing/webpack/plugin` plugin _(accepts `output` and `outputPath` options)_:

```js
plugins: [
   new BabelTimingPlugin(),
]
```

...with **options** _(accepts `output` and `outputPath` options)_:

```js
plugins: [
   new BabelTimingPlugin({output: "json", outputPath: "./results.json"}),
]
```

### As Jest integration

Monitor Babel while running your **actual Jest tests**.

1. Add the following `transform` and `reporters` entries to the existing Jest configuration:

```js
{
  transform: {
    '^.+\\.jsx?$': 'babel-timing/jest/transformer'
  },
  reporters: [
    'default',
    'babel-timing/jest/reporter'
  ]
}
```

...with **reporter's options** _(accepts `output` and `outputPath` options)_:

```js
{
  reporters: [
    'default',
    [
      'babel-timing/jest/reporter',
      {output: 'json', outputPath: './results.json'}
    ]
  ]
}
```

2. Run tests with [`--no-cache` option](https://jestjs.io/docs/en/cli#cache)

## Options

#### `babelConfig` / `--babel-config`

Type: `string | false`<br />
Default: `undefined`

Path to a custom [babel configuration file](https://babeljs.io/docs/en/options#configfile). By default Babel will try to load any existing valid configuration file.

#### `followImports` / `--follow-imports` _(experimental)_

Type: `bool`<br />
Default: `false`

Follow imported files/modules and run `babel-timing` against them.

#### `include` / `--include`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
Default: `['**']`

Include paths (imported ones also) according to the [provided glob patterns](https://www.npmjs.com/package/glob#glob-primer).

#### `exclude` / `--exclude`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
Default: `['**/modules/**']`

Exclude paths (imported ones also) according to the [provided glob patterns](https://www.npmjs.com/package/glob#glob-primer).

#### `resolveMainFields` / `--resolve-main-fields`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
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
  name: string;
  totalTime: number;
  plugins: {
    plugin: string;
    timePerVisit: number;
    time: number;
    visits: number;
  }[];
}[];
```

## Notes

This tool started as an attempt of measuring the time taken by Babel while running transpiled tests and compiling Webpack applications.

The main difficulty of monitoring Babel while running the aforementioned tools, consists of relating the `wrapPluginVisitorMethod` calls to the files actually being compiled.

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
- Xing [Hops team](https://github.com/xing/hops)

## Todo

- Add `csv` output option
- Expose `wrapPluginVisitorMethod`
- Provide a wider set of integrations (`rollup`, `parcel`, ...)
- Improve existing integrations
- Make `followImports` more reliable
- Consider paginating `PluginList` output

[ci-badge]: https://travis-ci.org/toomuchdesign/babel-timing.svg?branch=master
[ci]: https://travis-ci.org/toomuchdesign/babel-timing
