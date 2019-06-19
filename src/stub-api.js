const express = require('express')
const morgan = require('morgan')

module.exports = createStubApi

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
