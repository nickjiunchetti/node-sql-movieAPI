const WatchlistDB = require('../components/WatchlistDB')
const WatchMovieDB = require('../components/WatchMovieDB')

module.exports = class WatchlistController {
	async create_watchlist(req, res) {
		const userId = req.user.id
		const watchlistName = req.body.watchlistName

		const watchlist = await new WatchlistDB().createWatchList(userId, watchlistName)

		return res.status(watchlist.status).json(watchlist.data)

	}

	async add_movie_to_watchlist(req, res) {
		const userId = req.user.id
		const watchlistId = req.body.watchlistId
		const imdbID = req.body.imdbID
		const Title = req.body.Title

		const watchlist = await new WatchMovieDB().addMovieToWatchlist(userId, watchlistId, imdbID, Title)

		return res.status(watchlist.status).json(watchlist.data)
	}

	async get_user_watchlists(req, res) {
		const userId = req.user.id
		const watchlistName = req.query.watchlistName

		const watchlists = await new WatchlistDB().getUserWatchlists(userId, watchlistName)

		return res.status(watchlists.status).json(watchlists.data)
	}

	async get_all_watchlists(req, res) {
		const watchlistName = req.query.watchlistName

		const watchlists = await new WatchlistDB().getAllWatchlists(watchlistName)

		return res.status(watchlists.status).json(watchlists.data)
	}

	async delete_movie(req, res) {
		const userId = req.user.id
		const watchlistId = req.query.watchlistId
		const imdbID = req.query.imdbID
		const Title = req.query.Title

		const watchlist = await new WatchMovieDB().deleteMovieFromWatchlist(userId, watchlistId, imdbID, Title)

		return res.status(watchlist.status).send(watchlist.data)
	}

	async delete_watchlist(req, res) {
		const userId = req.user.id
		const watchlistId = req.query.watchlistId

		const watchlist = await new WatchlistDB().deleteWatchList(userId, watchlistId)

		return res.status(watchlist.status).send(watchlist.data)
	}
}