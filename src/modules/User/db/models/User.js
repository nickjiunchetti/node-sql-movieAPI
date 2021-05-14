/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       first_name:
 *         type: string
 *       last_name:
 *         type: integer
 *       nickname:
 *         type: string
 *       email:
 *         type: string      
 *       password:
 *         type: string
 *         format: password
 *       resetPasswordToken:
 *         type: string
 *       resetPasswordExpires:
 *         type: string
 *         format: date-time
 *       required:
 *         - email
 *         - username
 *         - password
 */

module.exports = (sequelize, type) => sequelize.define('user', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	first_name: type.STRING,
	last_name: type.STRING,
	nickname: {
		type: type.STRING,
		allowNull: false,
		unique: true
	},
	email: {
		type: type.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: type.STRING,
		allowNull: false,
	},
}, {
	timestamps: false,
})
