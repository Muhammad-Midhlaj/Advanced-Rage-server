# Crowdin API Client
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

A Node.js client for the 
[v1](https://support.crowdin.com/api/api-integration-setup/) and 
[v2](https://support.crowdin.com/enterprise/api/) Crowdin APIs

🚧 This is still a work in progress. To see what remains to be implemented, check out the [open issues](https://github.com/crowdin-node/crowdin-node/issues). 🚧

## Installation

```sh
npm install crowdin
```

## Basic Usage

```js
const crowdin = require('crowdin')({
  key: process.env.CROWDIN_KEY,
  schemaVersion: 'v2'
})

const projects = await crowdin.projects.getMany()
```

## Examples

To try out some examples, clone the repo and install dependencies:

```sh
git clone https://github.com/aletrejo/crowdin-wrapper
cd crowdin-wrapper
npm install
```

Then you can run the examples:

```js
node examples/v1-get-project-details.js
node examples/v2-add-files.js
```

## API

This module exports a single [factory function](https://www.youtube.com/watch?v=ImwrezYhw4w) 
that returns a Crowdin client:

### `createClient([options])`

- `options` Object
  - `key` String - Your Crowdin API key. Required.
  - `schemaVersion` String (optional) - Çan be `v1` or `v2`. Defaults to `v2`.
  - `hostname` String (optional) - Defaults to `api.crowdin.com`

The returned client is an object of deeply nested API operations like 
`crowdin.projects.files.getMany` and `crowdin.projects.branches.languages.progress.getMany`. 
Each of these operations returns a Promise to a [got](https://ghub.io/got) response object. 

See [docs/v1.md](docs/v1.md) and [docs/v2.md](docs/v2.md) for reference.

## Thanks

Special thanks to :sparkles:[Paul Le Cam](https://www.npmjs.com/~paul_lecam):sparkles: for donating the `crowdin` npm package name. 
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/aletrejo"><img src="https://avatars1.githubusercontent.com/u/15284993?v=4" width="100px;" alt=""/><br /><sub><b>Alejandra Trejo</b></sub></a><br /><a href="https://github.com/crowdin-node/crowdin-node/commits?author=aletrejo" title="Code">💻</a> <a href="https://github.com/crowdin-node/crowdin-node/commits?author=aletrejo" title="Documentation">📖</a> <a href="https://github.com/crowdin-node/crowdin-node/commits?author=aletrejo" title="Tests">⚠️</a> <a href="https://github.com/crowdin-node/crowdin-node/pulls?q=is%3Apr+reviewed-by%3Aaletrejo" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://zeke.sikelianos.com"><img src="https://avatars1.githubusercontent.com/u/2289?v=4" width="100px;" alt=""/><br /><sub><b>Zeke Sikelianos</b></sub></a><br /><a href="https://github.com/crowdin-node/crowdin-node/commits?author=zeke" title="Documentation">📖</a> <a href="#design-zeke" title="Design">🎨</a> <a href="#ideas-zeke" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/crowdin-node/crowdin-node/commits?author=zeke" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/TomPradat"><img src="https://avatars0.githubusercontent.com/u/16164512?v=4" width="100px;" alt=""/><br /><sub><b>TomPradat</b></sub></a><br /><a href="https://github.com/crowdin-node/crowdin-node/commits?author=TomPradat" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!