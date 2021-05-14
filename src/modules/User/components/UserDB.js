const { User } = require('../db')
const bcrypt = require('bcrypt')

const BCRYPT_SALT_ROUNDS = 12

module.exports = class UserDB {
	async createUser(nickname, email, password, first_name, last_name) {
		try {
			if (!nickname || !email || !password || !first_name || !last_name) {
				return {
					status: 401,
					data: {
						message: 'Preencha todos os parâmetro de entrada'
					}
				}
			}

			const nick_check = await User.findOne({
				where: {
					nickname
				}
			})

			const email_check = await User.findOne({
				where: {
					email
				}
			})

			if (email_check || nick_check) {
				const email_m = email_check ? 'E-mail' : ''
				const nick_m = nick_check ? 'Apelido' : ''
				const both_m = ((+!!email_check + +!!nick_check) === 2) ? ' e ' : ''
				const is_end = ((+!!email_check + +!!nick_check) === 2) ? 'ão ' : 'á'

				return { status: 406, data: { message: `${email_m + both_m + nick_m} já est${is_end} em uso` } }
			}

			const pass = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

			await User.create({
				nickname,
				email,
				password: pass,
				first_name,
				last_name
			})

			return {
				status: 201,
				data: {
					message: 'Usuário adicionado com sucesso'
				}
			}

		} catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao adicionar o usuário, verifique os parâmetros de entrada e tente novamente',
					error: `${error}`
				}
			}
		}
	}

	async updateUser(userId, nickname, email, password, first_name, last_name) {
		try {
			const user = await User.findOne({
				where: { id: userId }
			})

			const pass = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

			await user.update({
				nickname: nickname || user.nickname,
				email: email || user.email,
				password: pass || user.password,
				first_name: first_name || user.first_name,
				last_name: last_name || user.last_name
			})

			return {
				status: 200,
				data: { message: 'Usuário atualizado com sucesso' }
			}
		} catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao atualizar o usuário, verifique os parâmetros de entrada e tente novamente',
					error: `${error}`
				}
			}
		}
	}

	async deleteUser(userId) {
		try {
			const user = await User.findOne({
				where: { id: userId }
			})

			await user.destroy()

			return {
				status: 200,
				data: { message: 'Usuário deletado com sucesso' }
			}
		} catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao atualizar o usuário, verifique os parâmetros de entrada e tente novamente',
					error: `${error}`
				}
			}
		}
	}
}