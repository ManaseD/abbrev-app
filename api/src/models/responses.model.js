// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const responses = sequelizeClient.define('responses', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    abbrev_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'abbrev_sentence_user'
    },
    expansions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    sentence_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'abbrev_sentence_user'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'abbrev_sentence_user'
    },
    other_text: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  responses.associate = function (models) {
    const { abbreviations, sentences, users } = models

    responses.belongsTo(abbreviations, {
      foreignKey: 'abbrev_id'
    })
    responses.belongsTo(sentences, {
      foreignKey: 'sentence_id'
    })
    responses.belongsTo(users, {
      foreignKey: 'user_id'
    })
  }

  return responses
}
