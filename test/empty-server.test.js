const { withMusette } = require('./utils')

describe('When just started', () => {
  const { stubApi } = withMusette()

  describe('The stub API', () => {
    it('replies 404', async () => {
      await stubApi()
        .get('/')
        .expect(404)
    })
  })
})
