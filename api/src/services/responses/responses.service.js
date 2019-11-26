// Initializes the `responses` service on path `/responses`
const { Responses } = require('./responses.class');
const createModel = require('../../models/responses.model');
const hooks = require('./responses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/responses', new Responses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('responses');

  service.hooks(hooks);
};
