# Babel timing

Make available babel-minify’s [timing plugin](https://github.com/babel/minify/blob/babel-minify%400.5.0/scripts/plugin-timing.js) as a standalone library.

## Installation

```bash
npm i babel-timing -D
yarn add babel-timing -D
```

## Usage

### CLI

```bash
babel-timing path/to/file-1.js path/to/file-2.js
babel-timing path/to/file-*.js
babel-timing path/to/entrypoint.js --follow-imports
```

### Node

```js
const babelTiming = require('babel-timing').babelTiming;
babelTiming(['path/to/file.js'], options);
```

## Options

### `babelConfig` / `--babel-config`

Type: `string | false`<br />
Default: `false`

Path to a custom [babel configuration file](https://babeljs.io/docs/en/options#configfile). By default Babel will try to load any existing valid configuration file.

### `followImports` / `--follow-imports`

Type: `bool`<br />
Default: `false`

Follow imported files/modules (using [babel-collect-imports](https://github.com/babel-utils/babel-collect-imports)) and run `babel-timing` against them.

Currently only relative paths are considered.

### `importPatterns` / `--import-patterns`

Type: `string[]` *(cli accepts a string containing a comma-separated list)*<br />
Default: `undefined`

Include/exclude import paths according to the [provided patterns](https://github.com/sindresorhus/multimatch#readme).

### `output` / `--output`

Type: `string`<br />
Default: `"return"` (`"console"` when called via CLI)<br />
Options: `"return"`, `"console"`, `"json"`

Make `babel-timing` results available as:

- `"return"` return results' object
- `"console"` render results in console
- `"json"` save results as `babel-timing-results.json`

## Manual tests :)

```bash
node cli.js __fixtures__/file-1.js
node cli.js __fixtures__/file-1.js __fixtures__/file-2.js
node cli.js __fixtures__/*.js
node cli.js __fixtures__/entry.js --follow-imports
```

## Todo

- Add `csv` output option
- Expose `wrapPluginVisitorMethod`
- Provide a way to consume `babel-timing` from other tools like `webpack`, `jest`, `rollup`, etc..
- Find a testing strategy
- Unwrap and compile `node_modules` packages (absolute paths)
- Prevent nested import discovery
