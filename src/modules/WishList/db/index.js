const sequelize = require('sequelize')
const database = require('../../../config/database')
const userModel = require('../../User/db/models/User')
const wishListModel = require('./models/WishList')
const wishModel = require('./models/Wish')

const user = userModel(database, sequelize)
const wish = wishModel(database, sequelize)
const wishList = wishListModel(database, sequelize)



user.hasMany(wishList, { foreignKey: 'userAuthorId', onDelete: 'cascade' })
wishList.hasMany(wish, { foreignKey: 'wishlistId', onDelete: 'cascade' })

const WishListDBCollection = {
	Wish: wish,
	WishList: wishList
}
module.exports = WishListDBCollection