
require('dotenv-safe').config()

const assert = require('assert')
const { CROWDIN_API_KEY, CROWDIN_PROJECT_ID: projectId } = process.env

assert(CROWDIN_API_KEY, 'Create a .env file and set CROWDIN_API_KEY')
assert(projectId, 'Create a .env file and set CROWDIN_PROJECT_ID')

async function main () {
  const client = require('..')({
    schemaVersion: 'v1',
    key: CROWDIN_API_KEY
  })

  await client.projects.directories.delete(projectId, {
    name: 'github'
  }).catch(error => {
    console.log('unable to delete github directory; maybe it did not exist')
    console.trace(error)
  })

  // directory must be created before files can be added
  await client.projects.directories.add(projectId, {
    name: 'github/some-owner/some-repo',
    recursive: true
  })

  const addFilesResult = await client.projects.files.add(projectId, {
    files: {
      'github/some-owner/some-repo/README.md': 'I am the README.',
      'github/some-owner/some-repo/config.yml': 'is_yaml: true'
    }
  })

  console.log(addFilesResult.body)

  const updateFilesResult = await client.projects.files.update(projectId, {
    files: {
      'github/some-owner/some-repo/README.md': 'I am the README (STILL).',
      'github/some-owner/some-repo/config.yml': 'is_still_yaml: true'
    }
  })

  console.log(updateFilesResult.body)

  const exportFilesResult = await client.projects.files.export(projectId, {
    file: 'github/some-owner/some-repo/README.md',
    language: 'fr',
    json: false
  })

  console.log(exportFilesResult.body)
}

main()
