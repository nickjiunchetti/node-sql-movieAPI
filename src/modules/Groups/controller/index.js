const GroupDB = require('../components/GroupDB')
const UserDB = require('../components/GroupUserDB')
const PostDB = require('../components/GroupPostDB')

module.exports = class GroupsController {
	async create_group(req, res) {
		const userId = req.user.id
		const groupName = req.body.groupName
		const description = req.body.description
		const restricted = req.body.restricted

		const users = req.body.users

		const group = await new GroupDB().createGroup(userId, groupName, description, restricted, users)

		return res.status(group.status).json(group.data)
	}

	async add_user(req, res) {
		const userId = req.user.id
		const groupId = req.body.groupId
		const groupUserId = req.body.groupUserId

		const post = await new UserDB().addGroupUser(userId, groupId, groupUserId)

		return res.status(post.status).json(post.data)
	}


	async create_post(req, res) {
		const userId = req.user.id
		const groupId = req.body.groupId
		const text = req.body.text

		const post = await new PostDB().createPost(userId, groupId, text)

		return res.status(post.status).json(post.data)
	}

	async get_user_groups(req, res) {
		const userId = req.user.id
		const groupName = req.query.groupName

		const group = await new GroupDB().getUserGroups(userId, groupName)

		return res.status(group.status).json(group.data)
	}

	async get_all_groups(req, res) {
		const userId = req.user.id
		const groupName = req.query.groupName

		const group = await new GroupDB().getAllGroups(userId, groupName)

		return res.status(group.status).json(group.data)
	}

	async update_group(req, res) {
		const userId = req.user.id
		const groupId = req.body.groupId
		const groupName = req.body.groupName
		const description = req.body.description
		const restricted = req.body.restricted

		const group = await new GroupDB().updateGroup(userId, groupId, groupName, description, restricted)

		return res.status(group.status).json(group.data)
	}

	async delete_user(req, res) {
		const userId = req.user.id
		const groupId = req.query.groupId
		const groupUserId = parseInt(req.query.groupUserId)

		const post = await new UserDB().deleteGroupUser(userId, groupId, groupUserId)

		return res.status(post.status).json(post.data)
	}

	async delete_post(req, res) {
		const userId = req.user.id
		const postId = req.query.postId

		const post = await new PostDB().deletePost(userId, postId)

		return res.status(post.status).json(post.data)
	}

	async delete_group(req, res) {
		const userId = req.user.id
		const groupId = req.query.groupId

		const group = await new GroupDB().deleteGroup(userId, groupId)

		return res.status(group.status).json(group.data)
	}
}