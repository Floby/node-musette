const { withMusette } = require('./utils')

describe('When started', () => {
  const { stubApi, adminApi } = withMusette()

  context('Matcher: GET / -> "Hello World!" has been set up', () => {
    beforeEach('setup', () => {
      return adminApi()
        .post('/_match')
        .send({
          path: '/',
          reply: 'Hello World!'
        })
        .expect(201)
    })
    describe('stub: GET /', () => {
      it('replies 200', async () => {
        await stubApi()
          .get('/')
          .expect(200)
      })
      it('replies expected body', async () => {
        await stubApi()
          .get('/')
          .expect('Hello World!')
      })
    })
  })
})

