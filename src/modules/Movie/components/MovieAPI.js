const axios = require('axios')

module.exports = class MovieAPI {
	constructor() {
	}

	async search(imdbID, Title) {
		try {
			const params = { i: imdbID, t: Title, apikey: process.env.MOVIE_API_KEY }

			const ans = await axios.get('http://omdbapi.com/', { params })
			return {
				status: ans.status,
				data: ans.data
			}
		}

		catch (error) {
			return {
				status: error.response.status,
				data: { message: error.response.statusText }
			}
		}
	}
}