const assert = require('assert')
const pupa = require('pupa')

// Given an operation object and arguments to run that operation, generate a URL path
// by injecting the arguments into the requestPath template from the schema

module.exports = function generateRequestPath (operation, suppliedParams) {
  assert(operation.requestPath)
  assert(operation.validPathParams)

  const context = operation.validPathParams.reduce((ctx, paramName, i) => {
    ctx[paramName] = suppliedParams[i]
    return ctx
  }, {})

  const requestPath = pupa(operation.requestPath, context)

  return requestPath
}
