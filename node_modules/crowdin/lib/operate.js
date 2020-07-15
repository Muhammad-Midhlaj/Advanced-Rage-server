// This module exports a generic function for making HTTP requests.
// Each schema operation object is bound to this function

const got = require('got')
const URL = require('url')
const pkg = require('../package.json')
const generateRequestPath = require('./generate-request-path')
const generateQuery = require('./generate-query')
const generateFormBody = require('./generate-form-body')
const { isPlainObject, last } = require('lodash')

module.exports = async function operate (...args) {
  // pop options object off the args
  const opts = isPlainObject(last(args)) ? args.pop() : {}
  const url = URL.format({
    protocol: 'https',
    hostname: this.clientConfig.hostname,
    pathname: generateRequestPath(this, args),
    query: generateQuery(this, opts)
  })
  const body = generateFormBody(this, opts)
  const headers = {
    'user-agent': `${pkg.name}@${pkg.version} (https://ghub.io/${pkg.name})`
  }
  const requestOpts = {
    headers,
    json: !body || body.constructor.name !== 'FormData',
    body
  }

  // console.log('debug request', this.verb, url)

  return got[this.verb](url, requestOpts).catch(error => {
    // for methods like projects.files.export() which return raw file contents,
    // return response text because response body is not parseable JSON
    if (error.constructor.name === 'GotError' && error.message.includes('Unexpected token')) {
      return error.response
    }

    throw error
  })
}
