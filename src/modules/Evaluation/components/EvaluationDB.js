const { Op } = require('sequelize')
const MovieAPI = require('../../Movie/components/MovieAPI')
const { Evaluation } = require('../db')

module.exports = class EvaluationDB {

	async createEvaluation(userId, imdbID, Title, stars, score, comment, restricted) {
		try {
			if (!stars && !score && !comment) {
				return {
					status: 406,
					data: { message: `Uma avaliação precisa de nota, estrelas, ou comentários` }
				}
			}

			const checkStars = !stars || stars >= 0 && stars <= 5
			const checkScore = !score || score >= 5 && score <= 10

			if (!checkStars || !checkScore) {
				return {
					status: 406,
					data: { message: `Estrelas devem ser entre 0 e 5 e estrelas entre 5 e 10` }
				}
			}

			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await Evaluation.findOne({
				where: {
					imdbID: getMovie.data.imdbID,
					userAuthorId: userId
				}
			})

			if (exists) {
				return {
					status: 406,
					data: { message: `Ja existe uma avaliação do filme ${getMovie.data.Title} feita pelo usuário ${userId}` }
				}
			}

			const eval_res = await Evaluation.create({
				imdbID: getMovie.data.imdbID,
				Title: getMovie.data.Title,
				restricted: restricted,
				stars: stars,
				score: score,
				comment: comment,
				userAuthorId: userId,
			})

			return {
				status: 201,
				data: {
					message: `Avaliação do userId ${userId} para o filme ${eval_res.Title} feita com sucesso`,
					eval: eval_res
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao criar avaliação do usuário ${userId} para o filme ${Title || imdbID}, verifique os parametros de entrada`,
					error: `${error}`
				}
			}
		}
	}

	async getUserEvaluations(userId) {
		try {
			const evaluations = await Evaluation.findAll({
				where: { userAuthorId: userId }
			})

			if (evaluations.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhuma avaliação encontrada para o usuário ${userId}` }
				}
			}

			return {
				status: 200,
				data: evaluations
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao retornar avaliações do usuário ${userId}, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}

	async getMovieEvaluations(userId, imdbID, Title) {
		try {
			const getMovie = await new MovieAPI().search(imdbID, Title)

			let evaluations = await Evaluation.findAll({
				where: {
					[Op.or]:
						[
							{
								imdbID: getMovie.data.imdbID,
								userAuthorId: userId
							},
							{
								imdbID: getMovie.data.imdbID,
								restricted: false
							}
						]
				}
			})

			if (evaluations.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhuma avaliação pública ou do usuário ${userId} encontrada para o filme ${getMovie.data.Title}` }
				}
			}
			return {
				status: 200,
				data: evaluations
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao retornar avaliações do filme ${Title || imdbID}, verifique os parâmetros de entrada.`,
					error: `${error}`
				}
			}
		}
	}

	async updateEvaluation(userId, imdbID, Title, stars, score, comment, restricted) {
		try {
			const checkStars = !stars || stars >= 0 && stars <= 5
			const checkScore = !score || score >= 5 && score <= 10

			if (!checkStars || !checkScore) {
				return {
					status: 406,
					data: { message: `Estrelas devem ser entre 0 e 5 e notas entre 5 e 10` }
				}
			}

			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await Evaluation.findOne({
				where: {
					imdbID: getMovie.data.imdbID,
					userAuthorId: userId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `Não existe uma avaliação do filme ${getMovie.data.Title} feita pelo usuário ${userId}` }
				}
			}

			const eval_res = await exists.update({
				imdbID: getMovie.data.imdbID,
				Title: getMovie.data.Title,
				restricted: restricted || exists.restricted,
				stars: stars || exists.stars,
				score: score || exists.score,
				comment: comment || exists.comment,
				userAuthorId: userId,
			})

			return {
				status: 200,
				data: {
					message: `Avaliação do userId ${userId} para o filme ${eval_res.Title} atualizada com sucesso`,
					eval: eval_res
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao atualizar avaliação do usuário ${userId} para o filme ${Title || imdbID}, verifique os parametros de entrada.`,
					error: `${error}`
				}
			}
		}
	}

	async deleteEvaluation(userId, imdbID, Title) {
		try {
			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await Evaluation.findOne({
				where: {
					imdbID: getMovie.data.imdbID,
					userAuthorId: userId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `Não existe uma avaliação do filme ${getMovie.data.Title} feita pelo usuário ${userId}` }
				}
			}

			await exists.destroy()

			return {
				status: 200,
				data: { message: `Avaliação de ${getMovie.data.Title} deletada com sucesso` }
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao deletar avaliação do usuário ${userId} para o filme ${Title || imdbID}, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}
}