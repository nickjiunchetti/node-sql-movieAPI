const { Watchlist, WatchMovie } = require('../db')
const { Evaluation } = require('../../Evaluation/db')
const MovieAPI = require('../../Movie/components/MovieAPI')
const { Op } = require('sequelize')

module.exports = class WatchMovieDB {
	async addMovieToWatchlist(userId, watchlistId, imdbID, Title) {
		try {
			const checkList = await Watchlist.findOne({
				where: {
					[Op.or]:
						[
							{
								id: watchlistId,
								userAuthorId: userId
							},
							{ id: watchlistId }
						]
				}
			})

			if (!checkList) {
				return {
					status: 401,
					data: { message: `Lista watchlistId: ${watchlistId} não encontrada` }
				}
			}

			if (checkList.userAuthorId != userId) {
				return {
					status: 403,
					data: { message: `Lista não pertence ao userId: ${userId}` }
				}
			}


			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await WatchMovie.findOne({
				where: {
					imdbID: getMovie.data.imdbID,
					watchlistId
				}
			})

			if (exists) {
				return {
					status: 406,
					data: { message: `Filme ${getMovie.data.Title} já existe na watchlist` }
				}
			}

			const evaluation = await Evaluation.findOne({
				where: {
					userAuthorId: userId,
					imdbID: getMovie.data.imdbID
				}
			})

			if (!evaluation) {
				return {
					status: 406,
					data: { message: `Faça uma avaliação para o filme ${getMovie.data.Title} para poder indica-lo` }
				}
			}

			const watch_res = await WatchMovie.create({
				watchlistId,
				ownerId: userId,
				imdbID: getMovie.data.imdbID
			})

			return {
				status: 201,
				data: {
					message: `Filme ${getMovie.data.Title} adicionado com sucesso a watchlist`,
					indication: {
						Title: getMovie.data.Title,
						...watch_res.dataValues
					}
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao adicionar o filme a watchlist, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async deleteMovieFromWatchlist(userId, watchlistId, imdbID, Title) {
		try {
			const checkList = await Watchlist.findOne({
				where: {
					id: watchlistId
				}
			})

			if (!checkList)
				return {
					status: 401,
					data: { message: `Lista watchlistId: ${watchlistId} não encontrada` }
				}

			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await WatchMovie.findOne({
				where: {
					ownerId: userId,
					imdbID: getMovie.data.imdbID,
					watchlistId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `Avaliação do ${getMovie.data.Title} feita pelo userId ${userId} não encontrada na watchlistId: ${watchlistId}` }
				}
			}

			await exists.destroy()
			return {
				status: 200,
				data: { message: `${getMovie.data.Title} removido da watchlist com sucesso` }
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover o filme ${Title ? Title : 'imdbId:' + imdbID} da watchlist, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}
}