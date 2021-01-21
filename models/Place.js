const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Place extends Model {}

Place.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		place_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		latitude: {
			type: DataTypes.DECIMAL(7, 4),
			allowNull: false,
		},
		longitude: {
			type: DataTypes.DECIMAL(7, 4),
			allowNull: false,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		underscored: true,
		modelName: "place",
	}
);

module.exports = Place;
