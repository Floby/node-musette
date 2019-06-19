module.exports = MatcherQueue

function MatcherQueue () {
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

