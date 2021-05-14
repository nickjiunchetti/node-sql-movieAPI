const sequelize = require('sequelize')
const database = require('../../../config/database')
const userModel = require('../../User/db/models/User')

const user = userModel(database, sequelize)

const UserDBCollection = {
	User: user
}

module.exports = UserDBCollection;