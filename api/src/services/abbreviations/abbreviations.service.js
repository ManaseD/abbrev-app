// Initializes the `abbreviations` service on path `/abbreviations`
const { Abbreviations } = require('./abbreviations.class')
const createModel = require('../../models/abbreviations.model')
const hooks = require('./abbreviations.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  // const paginate = app.get('paginate')

  const options = {
    Model,
    paginate: 200
  }

  // Initialize our service with any options it requires
  app.use('/abbreviations', new Abbreviations(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('abbreviations')

  service.hooks(hooks)
}
