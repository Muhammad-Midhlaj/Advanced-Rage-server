const assert = require('assert')
const getSchema = require('./lib/get-schema')
const getOperations = require('./lib/get-operations')
const operate = require('./lib/operate')
const _ = require('lodash')

module.exports = function (opts = {}) {
  const defaults = {
    schemaVersion: 'v2',
    hostname: 'api.crowdin.com',
    key: null
  }

  // attach options to the client object
  const client = {
    config: Object.assign({}, defaults, opts)
  }

  assert(client.config.key, 'Missing required option: `key`')

  // Load the requested schema version and generate a list of operations
  const schema = getSchema(client.config.schemaVersion)
  const operations = getOperations(schema)

  // attach bound operations to the client object
  operations.forEach(operation => {
    operation.clientConfig = client.config
    _.set(client, operation.operationId, operate.bind(operation))
  })

  return client
}
