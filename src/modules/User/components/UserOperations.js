const { Op } = require('sequelize')
const { User } = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = class UserOperations {
	async login(nickname, email, password) {
		try {
			const user = await User.findOne({
				where: {
					[Op.or]: [
						{ nickname },
						{ email }
					]
				}
			})

			const valid_pass = await bcrypt.compare(password, user.password)

			if (valid_pass) {
				return {
					status: 200,
					data: {
						message: 'Autenticação bem sucedida',
						token: `JWT ${jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'keyboard cat', {
							expiresIn: 365 * 24 * 60 * 60,
						})}`
					}
				}
			}

			return { status: 406, data: { message: 'Erro ao autenticar usuário, verifique os parâmetros de entrada e tente novamente' } }

		} catch (e) {
			return { status: 406, data: { message: 'Erro ao autenticar usuário, verifique os parâmetros de entrada e tente novamente' } }
		}
	}
}