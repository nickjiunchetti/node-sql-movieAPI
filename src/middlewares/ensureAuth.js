const jwt = require('jsonwebtoken')


module.exports = function ensureAuth(req, res, next) {
	const authToken = req.headers.authorization

	if (!authToken)
		return res.status(401).json({ message: 'JWT Token inexistente' })

	try {
		const [, token] = authToken.split(' ')
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'keyboard cat')

		req.user = {
			id: decoded.id
		}

		return next()
	} catch (e) {
		return res.status(401).json({ message: 'JWT Token inválido' })
	}
}