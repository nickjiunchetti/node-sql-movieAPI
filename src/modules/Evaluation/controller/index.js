const EvaluationDB = require('../components/EvaluationDB')

module.exports = class EvaluationController {
	async create_user_evaluation(req, res) {
		const userId = req.user.id
		const imdbID = req.body.imdbID
		const Title = req.body.Title
		const stars = req.body.stars
		const score = req.body.score
		const comment = req.body.comment
		const restricted = req.body.restricted

		const evaluation = await new EvaluationDB().createEvaluation(userId, imdbID, Title, stars, score, comment, restricted)

		return res.status(evaluation.status).json(evaluation.data)
	}

	async get_user_evaluations(req, res) {
		const userId = req.user.id

		const evaluations = await new EvaluationDB().getUserEvaluations(userId)

		return res.status(evaluations.status).json(evaluations.data)
	}

	async get_movie_evaluations(req, res) {
		const userId = req.user.id
		const imdbID = req.query.imdbID
		const Title = req.query.Title

		const evaluations = await new EvaluationDB().getMovieEvaluations(userId, imdbID, Title)

		return res.status(evaluations.status).json(evaluations.data)
	}

	async update_user_evaluation(req, res) {
		const userId = req.user.id
		const imdbID = req.body.imdbID
		const Title = req.body.Title
		const stars = req.body.stars
		const score = req.body.score
		const comment = req.body.comment
		const restricted = req.body.restricted

		const evaluation = await new EvaluationDB().updateEvaluation(userId, imdbID, Title, stars, score, comment, restricted)

		return res.status(evaluation.status).json(evaluation.data)
	}

	async delete_user_evaluation(req, res) {
		const userId = req.user.id
		const imdbID = req.query.imdbID
		const Title = req.query.Title

		const evaluations = await new EvaluationDB().deleteEvaluation(userId, imdbID, Title)

		return res.status(evaluations.status).json(evaluations.data)
	}
}