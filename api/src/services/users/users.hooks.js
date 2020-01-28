const { authenticate } = require('@feathersjs/authentication').hooks
const { disallow, iff, isProvider } = require('feathers-hooks-common')
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), authenticate('jwt'))
    ],
    get: [
      iff(isProvider('external'), authenticate('jwt'))
    ],
    create: [
      authenticate('jwt'),
      // Require Admin
      iff(context => context.params.user.role !== 'admin', disallow()),
      hashPassword('password')
    ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
}
