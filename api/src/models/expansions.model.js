// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const expansions = sequelizeClient.define('expansions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    abbrev_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    expanded_text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  expansions.associate = function (models) {
    const { abbreviations } = models

    expansions.belongsTo(abbreviations, {
      foreignKey: 'abbrev_id'
    })
  }

  return expansions
}
