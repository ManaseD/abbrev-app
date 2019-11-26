// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const responses = sequelizeClient.define('responses', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    abbrev_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    expansion_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sentence_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    other_text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  responses.associate = function (models) {
    const { abbreviations, expansions, sentences, users } = models

    responses.belongsTo(abbreviations, {
      foreignKey: 'abbrev_id'
    })
    responses.belongsTo(expansions, {
      foreignKey: 'expansion_id'
    })
    responses.belongsTo(sentences, {
      foreignKey: 'sentence_id'
    })
    responses.belongsTo(users, {
      foreignKey: 'user_id'
    })
  };

  return responses;
};
