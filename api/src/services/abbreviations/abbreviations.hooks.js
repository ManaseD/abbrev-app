const { authenticate } = require('@feathersjs/authentication')
const { populate } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      populate({
        schema: {
          include: [
            {
              service: 'sentences',
              nameAs: 'sentences',
              parentField: 'id',
              childField: 'abbrev_id',
              asArray: true
            },
            {
              service: 'expansions',
              nameAs: 'expansions',
              parentField: 'id',
              childField: 'abbrev_id',
              asArray: true
            },
            {
              service: 'responses',
              nameAs: 'responses',
              parentField: 'id',
              childField: 'abbrev_id',
              asArray: true
            },
          ]
        }
      })
    ],
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
