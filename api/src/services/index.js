const abbreviations = require('./abbreviations/abbreviations.service.js');
const expansions = require('./expansions/expansions.service.js');
const responses = require('./responses/responses.service.js');
const sentences = require('./sentences/sentences.service.js');
const users = require('./users/users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(abbreviations);
  app.configure(expansions);
  app.configure(responses);
  app.configure(sentences);
  app.configure(users);
};
