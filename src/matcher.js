const { matchPattern } = require('url-matcher')

module.exports = Matcher

function Matcher (matchSpec) {
  const pattern = matchSpec.path
  const headers = matchSpec.headers || {}
  const response = {
    code: matchSpec.code || 200,
    body: matchSpec.reply || ''
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
