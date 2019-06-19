const supertest = require('supertest')
const { createServer } = require('../')

exports.withMusette = function withMusette () {
  let server
  let stubPort
  let adminPort
  beforeEach(() => {
    stubPort = Math.floor(10000 + Math.random() * 1000)
    adminPort = Math.floor(10000 + Math.random() * 1000)
    server = createServer({ stubPort, adminPort, log: false })
    return server.start()
  })
  afterEach(() => server.stop())

  function adminApi () {
    return supertest(`http://localhost:${adminPort}`)
  }
  function stubApi () {
    return supertest(`http://localhost:${stubPort}`)
  }
  return { adminApi, stubApi }
}

