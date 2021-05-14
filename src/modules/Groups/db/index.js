const sequelize = require('sequelize')
const database = require('../../../config/database')
const userModel = require('../../User/db/models/User')
const groupModel = require('./models/Group')
const groupPostModel = require('./models/GroupPost')
const groupUserModel = require('./models/GroupUser')

const user = userModel(database, sequelize)
const group = groupModel(database, sequelize)
const group_post = groupPostModel(database, sequelize)
const group_user = groupUserModel(database, sequelize)

group.hasMany(group_post, { foreignKey: 'groupId', onDelete: 'cascade' })

user.belongsToMany(group, { through: group_user, onDelete: 'cascade' })
group.belongsToMany(user, { through: group_user })

const GroupDBCollection = {
	Group: group,
	GroupPost: group_post,
	GroupUser: group_user
}
module.exports = GroupDBCollection