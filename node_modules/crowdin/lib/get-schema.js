// Crowdin V2 API docs:
// https://support.crowdin.com/enterprise/api/
// https://support.crowdin.com/assets/api/enterprise.yml

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const deref = require('json-schema-deref-sync')

module.exports = function getSchema (schemaVersion) {
  const schemaPath = path.join(__dirname, `../schemata/${schemaVersion}.yml`)
  const schemaData = yaml.safeLoad(fs.readFileSync(schemaPath, 'utf8'))
  const schema = deref(schemaData)
  return schema
}
