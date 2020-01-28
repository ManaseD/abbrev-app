const { authenticate } = require('@feathersjs/authentication')
const { setField } = require('feathers-authentication-hooks')

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [
      setField({ from: 'params.user.id', as: 'data.user_id' })
    ],
    get: [
      setField({ from: 'params.user.id', as: 'data.user_id' })
    ],
    create: [
     setField({ from: 'params.user.id', as: 'data.user_id' })
    ],
    update: [
      setField({ from: 'params.user.id', as: 'data.user_id' })
    ],
    patch: [
      setField({ from: 'params.user.id', as: 'data.user_id' })
    ],
    remove: [
      setField({ from: 'params.user.id', as: 'data.user_id' })
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
