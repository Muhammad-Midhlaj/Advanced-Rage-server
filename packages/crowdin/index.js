// Initialize functions
const { readFileSync } = require('fs')
require('dotenv').config()
/*
require('moment')
require('moment-duration-format')*/

// Initialize Canvas
/*let canvasLoaded = false
try {
  require('canvas')
  require('./src/utils/CanvasUtils.js').initializeHelpers()
  canvasLoaded = true
} catch (e) {}
*/
// Initialize client
/*const CLIENT_OPTIONS = {
  fetchAllMembers: true,
  enableEveryone: false,
  canvasLoaded
}*/

//console.log(readFileSync('bigtitle.txt', 'utf8').toString())

const uh = require('./src/uh.js')
/*const client = new uh(CLIENT_OPTIONS)*/
console.log('[32mLogged in successfully!')
