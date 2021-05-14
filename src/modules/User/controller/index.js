const UserOperations = require('../components/UserOperations')
const UserDB = require('../components/UserDB')

module.exports = class UserController {
	async register(req, res) {
		const nickname = req.body.nickname
		const email = req.body.email
		const password = req.body.password
		const first_name = req.body.first_name
		const last_name = req.body.last_name

		const new_user = await new UserDB().createUser(nickname, email, password, first_name, last_name)

		return res.status(new_user.status).json(new_user.data)
	}

	async login(req, res) {
		const nickname = req.body.nickname
		const email = req.body.email
		const password = req.body.password

		const autenticante = await new UserOperations().login(nickname, email, password)

		return res.status(autenticante.status).json(autenticante.data)
	}

	async update(req, res) {
		const userId = req.user.id
		const nickname = req.body.nickname
		const email = req.body.email
		const password = req.body.password
		const first_name = req.body.first_name
		const last_name = req.body.last_name

		const new_user = await new UserDB().updateUser(userId, nickname, email, password, first_name, last_name)
		return res.status(new_user.status).json(new_user.data)
	}

	async delete(req, res) {
		const userId = req.user.id

		const deleter_user = await new UserDB().deleteUser(userId)

		return res.status(deleter_user.status).json(deleter_user.data)
	}
}