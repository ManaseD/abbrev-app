// Initializes the `sentences` service on path `/sentences`
const { Sentences } = require('./sentences.class');
const createModel = require('../../models/sentences.model');
const hooks = require('./sentences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sentences', new Sentences(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sentences');

  service.hooks(hooks);
};
