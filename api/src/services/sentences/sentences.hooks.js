const { populate } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
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
              service: 'abbreviations',
              nameAs: 'abbreviation',
              parentField: 'abbrev_id',
              childField: 'id'
            },
            {
              service: 'expansions',
              nameAs: 'expansions',
              parentField: 'abbrev_id',
              childField: 'abbrev_id'
            },
            {
              service: 'responses',
              nameAs: 'response',
              parentField: 'id',
              childField: 'sentence_id'
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
