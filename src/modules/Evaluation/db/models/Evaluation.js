/*eslint-disable indent*/
/**
 * @openapi
 * definitions:
 *   Evaluation:
 *     type: object
 *     properties:
 */

module.exports = (sequelize, type) => sequelize.define('evaluation', {
	id: {
		type: type.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	imdbID: {
		type: type.STRING,
		allowNull: false
	},
	Title: {
		type: type.STRING,
		allowNull: false
	},
	restricted: {
		type: type.BOOLEAN,
		allowNull: false
	},
	stars: type.SMALLINT,
	score: type.SMALLINT,
	comment: type.TEXT
}, {
	timestamps: false,
})