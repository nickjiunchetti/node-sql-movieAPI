const { Watchlist, WatchMovie } = require('../db')
const { Evaluation } = require('../../Evaluation/db')
const MovieAPI = require('../../Movie/components/MovieAPI')
const { Op } = require('sequelize')

module.exports = class WatchDB {
	async createWatchList(userId, watchlistName) {
		try {
			if (!watchlistName) {
				return {
					status: 401,
					data: { message: 'Insira um nome para a watchlist' }
				}
			}

			const exists = await Watchlist.findOne({
				where: {
					userAuthorId: userId,
					name: watchlistName
				}
			})

			if (exists) {
				return {
					status: 406,
					data: { message: `Usuário ja possuí uma watchlist com o nome ${watchlistName}` }
				}
			}

			const watchlist = await Watchlist.create({
				userAuthorId: userId,
				name: watchlistName
			})

			return {
				status: 201,
				data: {
					message: `Lista criada com sucesso`,
					watchlist: watchlist
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao criar watchlist, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async getUserWatchlists(userId, watchlistName) {
		try {
			const watchlists = await Watchlist.findAll({
				where: {
					[Op.and]:
						[
							{ userAuthorId: userId },
							{ name: { [Op.like]: `%${watchlistName || ''}%` } }
						]
				},
				include: [{
					model: WatchMovie,
					required: false,
				}]
			})

			if (watchlists.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhuma watchlist ${watchlistName ? 'que contém ' + watchlistName : ''}encontrada para o userId ${userId}` }
				}
			}

			const answer_data = await Promise.all(watchlists.map(async (watchlist) => ({
				id: watchlist.id,
				name: watchlist.name,
				userAuthorId: watchlist.userAuthorId,
				indications:
					await Promise.all(watchlist.movies.map(async (movie) => {
						const getMovie = await new MovieAPI().search(movie.imdbID)
						const evaluation = await Evaluation.findOne({
							where: {
								imdbID: getMovie.data.imdbID,
								userAuthorId: movie.ownerId
							}
						})

						const res = {
							ownerId: movie.ownerId,
							stars: evaluation.stars,
							score: evaluation.score,
							movie: getMovie.data
						}

						return res
					}))
			})))

			return {
				status: 200,
				data: answer_data
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao retornar watchlists do userId ${userId}, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}

	async getAllWatchlists(watchlistName) {
		try {
			const watchlists = await Watchlist.findAll({
				where:
					{ name: { [Op.like]: `%${watchlistName || ''}%` } },
				include: [{
					model: WatchMovie,
					required: false,
				}]
			})

			if (watchlists.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhuma watchlist ${watchlistName ? 'que contém ' + watchlistName : ''}encontrada` }
				}
			}

			const answer_data = await Promise.all(watchlists.map(async (watchlist) => ({
				id: watchlist.id,
				name: watchlist.name,
				userAuthorId: watchlist.userAuthorId,
				indications:
					await Promise.all(watchlist.movies.map(async (movie) => {
						const getMovie = await new MovieAPI().search(movie.imdbID)
						const evaluation = await Evaluation.findOne({
							where: {
								imdbID: getMovie.data.imdbID,
								userAuthorId: movie.ownerId
							}
						})

						const res = {
							ownerId: movie.ownerId,
							stars: evaluation.stars,
							score: evaluation.score,
							movie: getMovie.data
						}

						return res
					}))
			})))

			return {
				status: 200,
				data: answer_data
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao retornar watchlist, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async deleteWatchList(userId, watchlistId,) {
		try {
			const exists = await Watchlist.findOne({
				where: {
					[Op.or]:
						[
							{
								[Op.and]:
									[
										{ id: watchlistId || '' },
										{ userAuthorId: userId }
									]
							},
							{ id: watchlistId || '' }
						]
				},
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `Lista de watchlistId: ${watchlistId} não encontrada` }
				}
			}

			if (exists.userAuthorId != userId) {
				return {
					status: 403,
					data: { message: `Lista de watchlistId: ${watchlistId} não pertence ao userId: ${userId}` }
				}
			}

			await exists.destroy()
			return { status: 200, data: { message: `Watchlist ${exists.name} removida com sucesso` } }
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover watchlist id: ${watchlistId}, verifique os parâmetros de entrada.`,
					error: `${error}`
				}
			}
		}
	}
}

