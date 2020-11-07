# Babel timing

[![Build status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]

Measure **[Babel](https://babeljs.io/) compilation time** **file by file**, **plugin by plugin**.

[![asciicast](https://asciinema.org/a/GANbL8RdBHqThWzujdhqZeeNh.svg)](https://asciinema.org/a/GANbL8RdBHqThWzujdhqZeeNh)

Profile Babel when your application or your tests take ages to build.

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
const { babelTiming } = require('babel-timing');
const results = await babelTiming(['path/to/file.js'], options);
```

### As Webpack integration

Profile Babel during the **actual Webpack bundling process**.

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
          customize: require.resolve(
            'babel-timing/webpack/babel-loader-customize'
          ),
        },
      },
    },
  ];
}
```

3. Add `babel-timing/webpack/plugin` plugin _(accepts the [render options][render-options])_:

```js
plugins: [new BabelTimingPlugin()];
```

...with **options** _(accepts `output` and `outputPath` options)_:

```js
plugins: [
  new BabelTimingPlugin({ output: 'json', outputPath: './results.json' }),
];
```

4. Delete `babel-loader` cache at `./node_modules/.cache/babel-loader/`

5. Start Webpack bundling process and wait for results

### As Jest integration

Profile Babel while running your **actual Jest tests**.

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

...with **reporter's options** _(accepts the [render options][render-options])_:

```js
{
  reporters: [
    'default',
    [
      'babel-timing/jest/reporter',
      { output: 'json', outputPath: './results.json' },
    ],
  ];
}
```

2. Run tests with [`--no-cache` option](https://jestjs.io/docs/en/cli#cache)

### Further integrations

- [Hops](./FURTHER-INTEGRATIONS.md#hops)

## Options

#### `babelConfig` / `--babel-config`

Type: `string | false`<br />
Default: `false`

Path to a custom [babel configuration file](https://babeljs.io/docs/en/options#configfile). By default Babel will try to load any existing valid configuration file.

#### `followImports` / `--follow-imports`

Type: `bool`<br />
Default: `false`

Follow imported files/modules and run `babel-timing` against them.

#### `include` / `--include`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
Default: `['**']`

Include paths (imported ones also) according to the [provided glob patterns](https://www.npmjs.com/package/glob#glob-primer).

#### `exclude` / `--exclude`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
Default: `['**/node_modules/**']`

Exclude paths (imported ones also) according to the [provided glob patterns](https://www.npmjs.com/package/glob#glob-primer).

#### `resolveMainFields` / `--resolve-main-fields`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
Default: `['browser', 'module', 'main']`

When importing from an npm package this option will determine [which fields](https://webpack.js.org/configuration/resolve/#resolvemainfields) in its `package.json` are checked.

#### `resolveExtensions` / `--resolve-extensions`

Type: `string[]` _(cli accepts a string containing a comma-separated list)_<br />
Default: `['.js', '.jsx', '.mjs', '.ts']`

Attempt to [resolve these extensions](https://webpack.js.org/configuration/resolve/#resolveextensions) in order. Any other extension won't be considered.

#### `--read-results` (CLI only, for Node use [`render` API][render-api])

Type: `string`<br />
Default: `undefined`

Skip compilation and render existing results from file at specified path.

### Render options

#### `output` / `--output`

Type: `string`<br />
Default: `"return"` (`"console"` when called via CLI or integrations)<br />
Options: `"return"`, `"console"`, `"json"`

Make `babel-timing` results available as:

- `"return"` return results' object
- `"console"` render results in console
- `"json"` save results as `babel-timing-results.json`

#### `outputPath` / `--output-path`

Type: `string`<br />
Default: `"./babel-timing-results.json"`

Path of output file in case `output` option is set to `"json"`.

#### `paginationSize` / `--pagination-size`

Type: `number`<br />
Default: `10`

Number of entries displayed in a page when rendering `"console"` output.

#### `aggregateBy` / `--aggregate-by`

Type: `string`<br />
Default: `"files"`<br />
Options: `"files"`, `"plugins"`

Output results aggregated by `files` or `plugins`.

#### `expandPackages` / `--expand-packages`

Type: `bool`<br />
Default: `false`

Expand results relative to `node_modules` packages file by file.

## How it works

Compile files with **Babel 7** and get **collect compilation info** through [`wrapPluginVisitorMethod`][wrappluginvisitormethod-docs] Babel config option.

### ResultList

**Compilation info** are by default extracted into the following data **structure**:

```typescript
type ResultList = {
  name: string; // file name
  time: number; // total compilation time
  // compilation info by babel plugin
  plugins: {
    name: string;
    time: number;
    timePerVisit: number;
    visits: number;
  }[];
}[];
```

## Notes

This tool started as an attempt of measuring the time taken by Babel while running transpiled tests and compiling Webpack applications.

The main difficulty of monitoring Babel while running the aforementioned tools, consists of relating the `wrapPluginVisitorMethod` calls to the files actually being compiled.

Any further idea/contribution to get to a better Babel profiling solution is welcome.

## Manual tests :)

```bash
node cli.js __fixtures__/file-1.js
node cli.js __fixtures__/file-1.js __fixtures__/file-2.js
node cli.js __fixtures__/*.js
node cli.js __fixtures__/entry.js --follow-imports
```

## API's

These API's are meant to integrate `babel-timing` with any bundler/tool using Babel.

### new Timer(filename)

`Timer` class returns timer instances used to hook Babel's [`wrapPluginVisitorMethod`][wrappluginvisitormethod-docs], keep track of transform times and return a [`ResultList`][resultlist] entry object for a given file.

```js
const { Timer } = require('babel-timing');
const timer = new Timer(fileName);

// This is the function to be provided to Babel's "wrapPluginVisitorMethod" option
timer.wrapPluginVisitorMethod;

// Called after Babel transformations, returns "Results" object for given file
timer.getResults();
```

### timersCollection

Utility function meant to temporarily store `Timer` instances into a Node module while Babel compiles.

```js
const { timersCollection } = require('babel-timing');

// Returns Timer instance for given file. Creates a new `Timer` instance if no timer for given file is found
timersCollection.getFile(fileName);

// Returns an array containing all the stored Timer instances
timersCollection.getAll();

timersCollection.clear();
```

### render(ResultList, options)

Accepts a `ResultList` array and renders an interactive CLI visualisation or outputs a JSON file of it.

```js
const { render } = require('babel-timing');
render(babelTimingResults, { options });
```

Accepts the [render options][render-options].

## Thanks to

- babel-minify’s [timing plugin](https://github.com/babel/minify/blob/babel-minify%400.5.0/scripts/plugin-timing.js)
- Facebook fbt's [timing plugin](https://github.com/facebookincubator/fbt/blob/20d627d6864dbd8cf8f188d84eb32ba324a81332/transform/util/time-plugins.js)
- This Stack Overflow's [question/answers](https://stackoverflow.com/questions/55537633/measure-babel-compilation-performance-per-file-or-module)
- Xing [Hops team](https://github.com/xing/hops)

## Todo

- Add `csv` output option
- Provide a wider set of integrations (`rollup`, `babelify`, `parcel`, ...)
- Improve existing integrations
- Consider versioning results JSON data shape
- Consider splitting standalone feature from core and integrations

[ci-badge]: https://travis-ci.org/toomuchdesign/babel-timing.svg?branch=master
[ci]: https://travis-ci.org/toomuchdesign/babel-timing
[npm]: https://www.npmjs.com/package/babel-timing
[npm-version-badge]: https://img.shields.io/npm/v/babel-timing.svg
[wrappluginvisitormethod-docs]: https://babeljs.io/docs/en/options#wrappluginvisitormethod
[render-options]: #render-options
[resultlist]: #resultList
[render-api]: #renderresultlist-options
