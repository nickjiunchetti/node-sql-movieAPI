/*eslint-disable indent*/
/**
 * @openapi
 * definitions:
 *   WishList:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       authorUserId:
 *         type: string
 */

module.exports = (sequelize, type) => sequelize.define('wishList', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: type.STRING,
		allowNull: false
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
			fields: ['name', 'userAuthorId']
		}
	]
})