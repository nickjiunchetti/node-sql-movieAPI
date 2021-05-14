const MovieAPI = require('../components/MovieAPI')

module.exports = class MovieController {
	async find_movie(req, res) {
		const imdbID = req.query.imdbID
		const Title = req.query.Title
		const movie = await new MovieAPI().search(imdbID, Title)

		return res.status(movie.status).json(movie.data)
	}
}