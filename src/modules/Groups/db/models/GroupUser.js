module.exports = (sequelize, type) =>
	sequelize.define('group_user', {}, {
		timestamps: false
	})