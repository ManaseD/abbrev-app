// Initializes the `expansions` service on path `/expansions`
const { Expansions } = require('./expansions.class');
const createModel = require('../../models/expansions.model');
const hooks = require('./expansions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/expansions', new Expansions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('expansions');

  service.hooks(hooks);
};
