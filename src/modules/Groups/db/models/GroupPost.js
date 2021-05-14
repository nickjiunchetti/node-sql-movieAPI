module.exports = (sequelize, type) => sequelize.define('groupPost', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ownerId: {
		type: type.INTEGER,
		allowNull: false
	},
	text: {
		type: type.TEXT,
		allowNull: false
	}
}, {
	timestamps: true
})