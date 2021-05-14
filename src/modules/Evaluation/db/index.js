const sequelize = require('sequelize')
const database = require('../../../config/database')
const evaluationModel = require('./models/Evaluation')
const userModel = require('../../User/db/models/User')

const evaluation = evaluationModel(database, sequelize)
const user = userModel(database, sequelize)

user.hasMany(evaluation, { foreignKey: 'userAuthorId', onDelete: 'cascade' })

const EvaluationDBCollection = {
	Evaluation: evaluation
}

module.exports = EvaluationDBCollection;