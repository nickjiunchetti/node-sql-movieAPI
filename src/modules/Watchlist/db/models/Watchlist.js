/*eslint-disable indent*/
/**
 * @openapi
 * definitions:
 *   WatchMovie:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       IMBdID:
 *         type: string
 *     required:
 *       - IMBdID
 */

module.exports = (sequelize, type) => sequelize.define('watchlist', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: type.STRING,
		allowNull: false
	},
}, {
	timestamps: false,
	indexes: [
		{
			unique: true,
			fields: ['name', 'userAuthorId']
		}
	]
})