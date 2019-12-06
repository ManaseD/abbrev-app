const { authenticate } = require('@feathersjs/authentication')
const { setField } = require('feathers-authentication-hooks')

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
     setField({ from: 'params.user.id', as: 'data.user_id' })
    ],
    update: [],
    patch: [],
    remove: []
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
