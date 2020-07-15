const generateRequestPath = require('../lib/generate-request-path')

describe('generateRequestPath', () => {
  test('generates a request path', () => {
    const operation = {
      requestPath: '/animals/{animal}/parts/{part}',
      validPathParams: ['animal', 'part']
    }
    const args = ['lizard', 'tail']
    const result = generateRequestPath(operation, args)
    expect(result).toBe('/animals/lizard/parts/tail')
  })
})
