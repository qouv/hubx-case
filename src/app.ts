import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { errorMiddleware } from './middlewares'
import { directorRoutes, movieRoutes } from './routes'

import { connectRedis } from './config/redis'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api/directors', directorRoutes.default)
app.use('/api/movies', movieRoutes.default)

app.use(errorMiddleware.default)

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb')
		console.log('MongoDB connected')
	} catch (error) {
		console.error('MongoDB connection error:', error)
		process.exit(1)
	}
}

const initialize = async () => {
	await connectDB()
	await connectRedis()
}

export { app, initialize }



