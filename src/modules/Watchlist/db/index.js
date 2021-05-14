const sequelize = require('sequelize')
const database = require('../../../config/database')
const userModel = require('../../User/db/models/User')
const WatchlistModel = require('./models/Watchlist')
const WatchMovieModel = require('./models/WatchMovie')

const user = userModel(database, sequelize)
const watchlist = WatchlistModel(database, sequelize)
const movie = WatchMovieModel(database, sequelize)



user.hasMany(watchlist, { foreignKey: 'userAuthorId', onDelete: 'cascade' })
watchlist.hasMany(movie, { foreignKey: 'watchlistId', onDelete: 'cascade' })

const WatchlistDBCollection = {
	Watchlist: watchlist,
	WatchMovie: movie
}
module.exports = WatchlistDBCollection