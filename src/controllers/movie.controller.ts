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

	async getAllMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const movies = await this.movieService.getAllMovies()

			res.status(200).json(movies)
		} catch (error) {
			next(error)
		}
	}

	async updateMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const movie = await this.movieService.updateMovie(req.params.id, req.body)

			if (!movie) {
				res.status(404).json({ message: 'Movie not found' })
				return
			}

			res.status(200).json()
		} catch (error) {
			next(error)
		}
	}

	async deleteMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const movie = await this.movieService.deleteMovie(req.params.id)

			if (!movie) {
				res.status(404).json({ message: 'Movie not found' })
				return
			}

			res.status(204).json()
		} catch (error) {
			next(error)
		}
	}
}
