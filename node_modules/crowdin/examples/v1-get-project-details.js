
require('dotenv-safe').config()

const assert = require('assert')
const { CROWDIN_API_KEY, CROWDIN_PROJECT_ID } = process.env

assert(CROWDIN_API_KEY, 'Create a .env file and set CROWDIN_API_KEY')
assert(CROWDIN_PROJECT_ID, 'Create a .env file and set CROWDIN_PROJECT_ID')

async function main () {
  const client = require('..')({
    schemaVersion: 'v1',
    key: CROWDIN_API_KEY
  })

  const result = await client.projects.getDetails(CROWDIN_PROJECT_ID)
  console.log(result.body)
}

main()
