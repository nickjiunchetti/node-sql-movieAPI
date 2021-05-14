/*eslint-disable indent*/
/**
 * @openapi
 * definitions:
 *   Watchlist:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       authorUserId:
 *         type: string
 */

module.exports = (sequelize, type) => sequelize.define('movie', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ownerId: {
		type: type.INTEGER,
		allowNull: false
	},
	imdbID: {
		type: type.STRING,
		allowNull: false
	}
}, {
	timestamps: false,
	indexes: [
		{
			unique: true,
			fields: ['ownerId', 'imdbID']
		}
	]
})