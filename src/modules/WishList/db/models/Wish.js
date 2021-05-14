/*eslint-disable indent*/
/**
 * @openapi
 * definitions:
 *   Wish:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       IMBdID:
 *         type: string
 *     required:
 *       - IMBdID
 */

module.exports = (sequelize, type) => sequelize.define('wish', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	imdbID: {
		type: type.STRING,
		allowNull: false
	}
}, {
	timestamps: false,
})