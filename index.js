const express = require('express')
const { promisify } = require('util')
const { matchPattern } = require('url-matcher')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const http = require('http')

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

function MatchersQueue () {
  let matchers = []

  this.push = (matcher) => {
    console.log('adding matcher', matcher.toString())
    matchers.push(matcher)
  }
  this.popMatch = (req) => {
    const index = matchers.findIndex((matcher) => matcher.match(req))
    if (index >= 0) {
      const matcher = matchers[index]
      console.log('found matcher', matcher.toString())
      matchers = matchers.slice(0, index).concat(matchers.slice(index + 1))
      return matcher
    }
  }
  this.clear = () => {
    matchers = []
  }
}

function Matcher (matchSpec) {
  const pattern = matchSpec.path
  const headers = matchSpec.headers || {}
  const response = {
    code: matchSpec.code || 200,
    body: matchSpec.body || ''
  }
  this.response = () => ({ ...response })

  this.match = (req) => {
    if (!matchPattern(pattern, req.url)) {
      return false
    }
    const headersMatch = Object.entries(headers).every(([key, value]) => {
      return req.headers[key] === value
    })
    return headersMatch
  }
  this.toString = () => `Match(${pattern})`
}


function createServer ({ stubPort, adminPort, log=true }) {
  const matchersQueue = new MatchersQueue()
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
