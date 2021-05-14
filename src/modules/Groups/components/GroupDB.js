const { Op } = require('sequelize')
const { Group, GroupPost } = require('../db')
const { User } = require('../../User/db')

module.exports = class GroupDB {
	async createGroup(userId, groupName, description, restricted, users) {
		try {
			if (!groupName) {
				return {
					status: 406,
					data: { message: 'Insira um nome para o grupo' }
				}
			}

			if (restricted === true && users.length === 0) {
				return {
					status: 406,
					data: { message: 'Grupos privados precisam de uma lista de usuários' }
				}
			}

			if (restricted === true && users.length > 0) {
				let userNotFound
				const falseIds = []
				await Promise.all(users.map(async (userId) => {
					const exist_user = await User.findOne({
						where: {
							id: userId
						}
					})

					if (!exist_user) {
						userNotFound = true
						falseIds.push(userId)
					}
				}))

				if (userNotFound)
					return {
						status: 406,
						data: { message: `Nenhum usuário encontrado para os userId: [${falseIds}]. Verifique os parâmetros de entrada` }
					}
			}

			const exists = await Group.findOne({
				where: {
					ownerId: userId,
					name: groupName
				}
			})

			if (exists) {
				return {
					status: 406,
					data: { message: `Usuário ja possuí um grupo com o nome ${groupName}` }
				}
			}

			const new_group = await Group.create({
				ownerId: userId,
				name: groupName,
				description: description,
				restricted: restricted
			})

			if (restricted === true && users.length > 0) {
				const groupUsers = users
				if (!groupUsers.includes(userId)) {
					groupUsers.push(userId)
				}

				await Promise.all(groupUsers.map(async (groupUser) => {
					await new_group.addUser(groupUser)
				}))
			}

			const result = await Group.findOne({
				where: {
					ownerId: userId,
					name: groupName
				},
				include: User
			})

			return {
				status: 201,
				data: {
					message: `Grupo criado com sucesso.`,
					group: result
				}
			}
		}

		catch (error) {
			const new_group = await Group.findOne({
				where: {
					ownerId: userId,
					name: groupName
				}
			})

			await new_group.destroy()

			return {
				status: 406,
				data: {
					message: 'Erro ao criar o grupo, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async getUserGroups(userId, groupName) {
		try {
			const user_groups = await Group.findAll({
				where: {
					[Op.and]:
						[
							{ ownerId: userId || '' },
							{ name: { [Op.like]: `%${groupName || ''}%` } }
						]
				},
				include: [
					{
						model: GroupPost,
						required: false
					},
					{
						model: User,
						required: false,
					}]
			})

			if (user_groups.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhum grupo ${groupName ? 'que contém ' + groupName : ''} encontrado para o userId ${userId}` }
				}
			}

			return {
				status: 200,
				data: user_groups
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao encontrar grupos ${groupName ? 'que contém ' + groupName : ''} para o userId ${userId}.`,
					error: `${error}`
				}
			}
		}
	}

	async getAllGroups(userId, groupName) {
		try {
			const all_groups = await Group.findAll({
				where: {
					[Op.and]:
						[
							{ name: { [Op.like]: `%${groupName || ''}%` } },
							{
								[Op.or]:
									[
										{ ownerId: userId || '' },
										{ restricted: false }
									]
							}
						]
				},
				include: [
					{
						model: GroupPost,
						required: false
					},
					{
						model: User,
						required: false,
					}]
			})

			if (all_groups.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhum grupo público ou do userId: ${userId} ${groupName ? 'que contém ' + groupName : ''} encontrado.` }
				}
			}

			return {
				status: 200,
				data: all_groups
			}
		}
		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao encontrar grupos públicos ou do userId${userId} ${groupName ? ' que contém ' + groupName : ''}.`,
					error: `${error}`
				}
			}
		}
	}

	async updateGroup(userId, groupId, groupName, description, restricted) {
		try {
			if (!groupId && !groupName && !description && !restricted) {
				return {
					status: 406,
					data: { message: `Os parâmetros de entrada não podem ser vazios` }
				}
			}

			const exists = await Group.findOne({
				where: {
					id: groupId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `Nenhum grupo encontrado com o groupId: ${groupId}` }
				}
			}

			if (exists.ownerId != userId) {
				return {
					status: 406,
					data: { message: `Grupo não pertence ao userId: ${userId}` }
				}
			}

			await exists.update({
				ownerId: userId || exists.ownerId,
				name: groupName || exists.name,
				description: description || exists.description,
				restricted: restricted || exists.restricted
			})

			return {
				status: 200,
				data: {
					message: `Grupo atualizado com sucesso.`,
					group: exists
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao atualizar o grupo ${groupName ? groupName : 'groupdId: ' + groupId} verifique os parâmetros de entrada.`,
					error: `${error}`
				}
			}
		}
	}

	async deleteGroup(userId, groupId) {
		try {
			const exists = await Group.findOne({
				where: {
					id: groupId,
					ownerId: userId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `GroupId: ${groupId} não existe ou não pertence ao userId: ${userId}` }
				}
			}

			await exists.destroy()

			return {
				status: 200,
				data: { message: `GroupId: ${groupId} removido com sucesso.` }
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover o GroupId: ${groupId}, verifique os parâmetros de entrada.`,
					error: `${error}`
				}
			}
		}
	}
}

