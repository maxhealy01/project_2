const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Place extends Model {}

Place.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    latitude: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'place'
  }
)

module.exports = Place;