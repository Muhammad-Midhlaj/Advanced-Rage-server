const { pick } = require('lodash')

module.exports = function generateQuery (operation, suppliedParams) {
  const defaults = {
    key: operation.clientConfig.key,
    // Crowdin responds with XML by default. JSON is preferable.
    json: true
  }

  const query = Object.assign(
    {},
    defaults,
    pick(suppliedParams, operation.validQueryParams)
  )

  return query
}
