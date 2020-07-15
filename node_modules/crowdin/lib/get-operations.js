const Operation = require('./operation')

module.exports = function getOperations (schema) {
  const operations = []

  for (const [requestPath, operationsAtPath] of Object.entries(schema.paths)) {
    for (const [verb, props] of Object.entries(operationsAtPath)) {
      const operation = new Operation(verb, requestPath, props)
      operations.push(operation)
    }
  }

  return operations
}
