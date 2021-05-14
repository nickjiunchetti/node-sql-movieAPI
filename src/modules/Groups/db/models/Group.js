module.exports = (sequelize, type) => sequelize.define('group', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ownerId: {
		type: type.INTEGER,
		allowNull: false
	},
	name: {
		type: type.STRING,
		allowNull: false
	},
	description: {
		type: type.TEXT
	},
	restricted: {
		type: type.BOOLEAN,
		allowNull: false
	}
}, {
	timestamps: false,
	indexes: [
		{
			unique: true,
			fields: ['name', 'ownerId']
		}
	]
})