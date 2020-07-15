const Validator = require('openapi-schema-validator').default
const validator = new Validator({ version: 3 })
const getSchema = require('../lib/get-schema')
const yaml = require('js-yaml')

describe('schema validation', () => {
  test('v1', () => {
    const result = validator.validate(getSchema('v1'))
    const message = `Errors found in v1 schema:\n\n ${yaml.safeDump(result.errors)}`
    expect(result.errors.length === 0, message).toBe(true)
  })

  test.skip('v2', () => {
    const result = validator.validate(getSchema('v2'))
    const message = `Errors found in v2 schema:\n\n ${yaml.safeDump(result.errors)}`
    expect(result.errors.length === 0, message).toBe(true)
  })
})
