const { authenticate } = require('@feathersjs/authentication')
const { disallow } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      disallow('external')
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disallow('external')
    ],
    remove: [
      disallow('external')
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
