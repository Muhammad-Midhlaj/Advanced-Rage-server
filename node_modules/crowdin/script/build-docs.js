#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const { chain } = require('lodash')
const markdownTable = require('markdown-table')

const getSchema = require('../lib/get-schema')
const getOperations = require('../lib/get-operations')
const schemaVersions = ['v1', 'v2']
const docsPath = path.join(__dirname, '../docs')

const template = `
# Crowdin API {{schemaVersion}}

## Operations

{{#each operations}}
- [{{fullSignature}}](#{{slug}})
{{/each}}

{{#each operations}}
<a id="{{slug}}" href="#{{slug}}">
  <h2>{{fullSignature}}</h2>
</a>

> {{summary}}

**Parameters**

{{paramsTable}}

{{/each}}
`

schemaVersions.forEach(schemaVersion => {
  const outfile = path.join(docsPath, `${schemaVersion}.md`)
  const schema = getSchema(schemaVersion)
  const operations = getOperations(schema)
    // decorate operations with extra properties for documentation
    .map(operation => {
      const paramsTable = tableize(operation.parameters)
      return Object.assign(operation, { paramsTable })
    })
  const output = handlebars.compile(template)({ schemaVersion, operations })
  fs.writeFileSync(outfile, output)
})

function tableize (params) {
  const headings = chain(params)
    .map(param => Object.keys(param))
    .flatten()
    .uniq()
    .value()

  const rows = params.map(param => {
    return headings.map(heading => param[heading])
  })

  return markdownTable([headings].concat(rows))
}
