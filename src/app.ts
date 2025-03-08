import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.middleware';


dotenv.config()

const app = express()

app.use(express.json())

app.use(errorMiddleware);

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb');
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
}

export { app, connectDB }



