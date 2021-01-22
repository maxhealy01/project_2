const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Message extends Model {}

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		sent_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				as: "sent_id",
				key: "id",
			},
		},
		received_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				as: "received_id",
				key: "id",
			},
		},
		message: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		freezeTableName: true,
		underscored: true,
		modelName: "message",
	}
);

module.exports = Message;
