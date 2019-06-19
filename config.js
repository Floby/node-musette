const { Envie, Joi } = require('envie')

module.exports = Envie({
  PORT: Joi
    .number()
    .description('The port on which to serve the stubbed API')
    .default(8080),
  ADMIN_PORT: Joi
    .number()
    .description('The port on which to serve the programmable API')
    .default(9090),
})
