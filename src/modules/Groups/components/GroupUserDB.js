const { Group, GroupUser } = require('../db')
const { User } = require('../../User/db')

module.exports = class GroupUserOperations {

	async addGroupUser(userId, groupId, groupUserId) {
		try {
			const exist_user = await User.findOne({
				where: {
					id: groupUserId
				}
			})

			if (!exist_user) {
				return {
					status: 406,
					data: { message: `UserId: ${groupUserId} não existe` }
				}
			}

			const group = await Group.findOne({
				where: {
					id: groupId,
					ownerId: userId
				},
				include: User
			})

			if (!group) {
				return {
					status: 406,
					data: { message: `GroupId: ${groupId} não encontrado ou não pertence ao userId: ${userId}` }
				}
			}

			if (group.restricted === false) {
				return {
					status: 406,
					data: { message: `GroupId: ${groupId} não é privado` }
				}
			}

			const userInGroup = []
			group.users.map((user) => {
				if (user.id === groupUserId) {
					userInGroup.push(user.id)
				}
			})

			if (userInGroup.length > 0) {
				return {
					status: 406,
					data: { message: `UserId: ${groupUserId} ja pertence ao GroupId: ${groupId}` }
				}
			}

			await group.addUser(groupUserId)

			const res_group = await Group.findOne({
				where: {
					id: groupId,
					ownerId: userId
				},
				include: User
			})

			return {
				status: 201,
				data: {
					message: `UserId: ${groupUserId} adicionado ao groupId: ${groupId}`,
					group: res_group
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao adicionar userId: ${userId} ao grupo ${groupId}`,
					error: `${error}`
				}
			}
		}
	}

	async deleteGroupUser(userId, groupId, groupUserId) {
		try {
			const exist_user = await User.findOne({
				where: {
					id: groupUserId
				}
			})

			if (!exist_user) {
				return {
					status: 406,
					data: { message: `UserId: ${groupUserId} não existe` }
				}
			}

			const group = await Group.findOne({
				where: {
					id: groupId,
					ownerId: userId
				},
				include: User
			})

			if (!group) {
				return {
					status: 406,
					data: { message: `GroupId: ${groupId} não encontrado ou não pertence ao userId: ${userId}` }
				}
			}

			if (group.restricted === false) {
				return {
					status: 406,
					data: { message: `GroupId: ${groupId} não é privado` }
				}
			}

			if (group.ownerId === groupUserId) {
				return {
					status: 406,
					data: { message: `UserId: ${userId} é dono do groupId: ${groupId}` }
				}
			}

			const userInGroup = []
			group.users.map((user) => {
				if (user.id === groupUserId) {
					userInGroup.push(user.id)
				}
			})

			if (userInGroup.length === 0) {
				return {
					status: 406,
					data: { message: `UserId: ${groupUserId} não pertence ao GroupId: ${groupId}` }
				}
			}

			await group.removeUser(groupUserId)

			const result = await Group.findOne({
				where: {
					id: groupId,
					ownerId: userId
				},
				include: User
			})

			return {
				status: 200,
				data: {
					message: `UserId: ${groupUserId} removido do grupo ${groupId}`,
					group: result
				}
			}
		}


		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover userId: ${groupUserId} do grupo ${groupId}`,
					error: `${error}`
				}
			}
		}
	}
}

