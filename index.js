const express = require('express')
const { promisify } = require('util')
const { matchPattern } = require('url-matcher')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const http = require('http')
const Matcher = require('./src/matcher')
const MatcherQueue = require('./src/matcher-queue')

function createStubApi (matchersQueue, log=true) {
  const api = express()
  log && api.use(morgan('[STUB] :method :url :status :res[content-length] - :response-time ms'))
  api.use((req, res, next) => {
    const matcher = matchersQueue.popMatch(req)
    if (!matcher) {
      return next()
    }
    const response = matcher.response()
    res.status(response.code).send(response.body)
  })
  return api
}

function createAdminApi (matchersQueue, log=true) {
  const admin = express()
  log && admin.use(morgan('[ADMIN] :method :url :status :res[content-length] - :response-time ms'))
  admin.use(bodyParser.urlencoded({ extended: false }))
  admin.use(bodyParser.json())
  admin.post('/_match', (req, res) => {
    const matcher = new Matcher(req.body)
    matchersQueue.push(matcher)
    res.status(201).send({})
  })
  admin.post('/_clear', (req, res) => {
    matchersQueue.clear()
    res.status(204).end()
  })
  return admin
}

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
