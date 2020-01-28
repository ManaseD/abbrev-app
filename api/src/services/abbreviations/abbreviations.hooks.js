const { authenticate } = require('@feathersjs/authentication')
const { disallow, populate } = require('feathers-hooks-common')

const get = require('lodash/get')

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt')
    ],
    get: [
      disallow('external')
    ],
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
              select: (context, parentItem, depth) => ({ user_id: get(context, 'params.user.id') }),
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
