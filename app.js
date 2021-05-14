require("dotenv/config")
const express = require('express')
const routes = require('./src/routes')
const helmet = require('helmet')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'REST API - Movie Challenge',
			version: '1.0.0'
		},
	},
	securityDefinitions: {
		bearerAuth: {
			type: 'apiKey',
			name: 'Authorization',
			scheme: 'bearer',
			in: 'header'
		}
	},
	apis: ['./routes/*.js']
}

const openapiSpecifications = swaggerJsdoc(options)

const app = express()

const api_port = process.env.API_PORT || 3000

app.get('/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.send(openapiSpecifications)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecifications))

app.use(express.json())
app.use(helmet())
app.use(routes)

app.listen(api_port, () => {
	console.log(`🎬 Server started on port ${api_port}`)
})

