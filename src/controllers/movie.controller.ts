import { NextFunction, Request, Response } from 'express'
import { MovieService } from '../services/movie.service'

export class MovieController {
	private movieService: MovieService

	constructor() {
		this.movieService = new MovieService()
	}

	async createMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.movieService.createMovie(req.body)

			res.status(201).json()
		} catch (error) {
			next(error)
		}
	}
}
