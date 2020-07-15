const { isEmpty, pick } = require('lodash')
const FormData = require('form-data')

module.exports = function generateFormBody (operation, suppliedParams) {
  if (!['put', 'post'].includes(operation.verb)) return null

  // build object of valid body params
  const filteredBody = pick(suppliedParams, operation.validBodyParams)

  if (isEmpty(filteredBody)) return null

  const body = new FormData()

  if (filteredBody.files) {
    Object.keys(filteredBody.files).forEach(filename => {
      body.append(`files[${filename}]`, Buffer.from(filteredBody.files[filename]), filename)
    })
  }

  return body
}
