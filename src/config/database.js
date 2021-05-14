const Sequelize = require('sequelize')

const db_name = process.env.DB_NAME || 'movieapi'
const db_user = process.env.DB_USER || 'root'
const db_password = process.env.DB_PASSWORD || 'secret'
const db_host = process.env.HOST || 'localhost'
const db_port = process.env.MYSQL_PORT || 3306

const database = new Sequelize(db_name, db_user, db_password, {
	host: db_host,
	dialect: 'mysql',
	port: db_port,
	logging: false,
	pool: {
		max: 20,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: { freezeTableName: true }
})

database.sync().then(() => {
	// eslint-disable-next-line no-console

})

module.exports = database