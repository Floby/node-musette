const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Matcher = require('./matcher')

module.exports = createAdminApi

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

