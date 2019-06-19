const { promisify } = require('util')
const http = require('http')
const MatcherQueue = require('./src/matcher-queue')
const createStubApi = require('./src/stub-api')
const createAdminApi = require('./src/admin-api')

function createServer ({ stubPort, adminPort, log=true }) {
  const matchersQueue = new MatcherQueue()
  const stubApi = createStubApi(matchersQueue, log)
  const adminApi = createAdminApi(matchersQueue, log)
  const stubServer = http.createServer(stubApi)
  const adminServer = http.createServer(adminApi)
  async function start () {
    const startStub = promisify(stubServer.listen.bind(stubServer))
    const startAdmin = promisify(adminServer.listen.bind(adminServer))
    await Promise.all([startStub(stubPort), startAdmin(adminPort)])
  }
  async function stop () {
    const stopStub = promisify(stubServer.close.bind(stubServer))
    const stopAdmin = promisify(adminServer.close.bind(adminServer))
    await Promise.all([stopStub(), stopAdmin()])
  }
  return { start, stop }
}


module.exports = { createServer }
