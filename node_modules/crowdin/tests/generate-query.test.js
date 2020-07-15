const generateQuery = require('../lib/generate-query')

describe('generateRequestQuery', () => {
  test('injects key and json by default', () => {
    const operation = {
      clientConfig: {
        key: 'secret-123'
      },
      validQueryParams: ['name', 'branch']
    }
    const params = {
      name: 'file.md',
      branch: 'some-branch'
    }
    const result = generateQuery(operation, params)
    expect(result).toEqual({
      key: 'secret-123',
      json: true,
      name: 'file.md',
      branch: 'some-branch'
    })
  })

  test('allows an empty query object', () => {
    const operation = {
      clientConfig: {
        key: 'secret-123'
      },
      validQueryParams: ['name', 'branch']
    }

    const result = generateQuery(operation)
    expect(result).toEqual({
      key: 'secret-123',
      json: true
    })
  })

  test('omits supplied params that are not specified in the schema', () => {
    const operation = {
      clientConfig: {
        key: 'secret-123'
      },
      validQueryParams: ['name', 'branch']
    }
    const params = {
      name: 'file.md',
      branch: 'some-branch',
      extraParam: 'hello'
    }
    const result = generateQuery(operation, params)
    expect(result).toEqual({
      key: 'secret-123',
      json: true,
      name: 'file.md',
      branch: 'some-branch'
    })
  })
})
