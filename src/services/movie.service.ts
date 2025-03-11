import { MovieRepository } from '../repositories/movie.repository'
import { DirectorService } from './director.service'
import { IMovie } from '../models/movie.model'
import mongoose from 'mongoose'
import { AppError } from '../utils/error.utils'
import { formatMovieName } from '../utils/format.utils'

export class MovieService {
	private movieRepository: MovieRepository
	private directorService: DirectorService

	constructor() {
		this.movieRepository = new MovieRepository()
		this.directorService = new DirectorService()
	}

	// Validate director ID format and existence
	private async validateDirector(directorId?: string): Promise<void> {
		if (directorId) {
			if (!mongoose.Types.ObjectId.isValid(directorId)) {
				throw new AppError('Invalid director ID format', 400)
			}

			const director = await this.directorService.getDirectorById(directorId)

			if (!director) {
				throw new AppError('Director not found', 404)
			}
		}
	}

	async createMovie(movieData: Partial<IMovie>): Promise<IMovie> {
		if(movieData.director) {
			// Verify director exists
			await this.validateDirector(movieData.director?.toString())
		}

		if(movieData.title) {
			movieData.title = formatMovieName(movieData.title)
		}

		return this.movieRepository.create(movieData)
	}

	async getAllMovies(): Promise<IMovie[]> {
		return this.movieRepository.findAll()
	}

	async updateMovie(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
		// Verify director exists
		if (movieData.director) {
			await this.validateDirector(movieData.director?.toString())
		}
		return this.movieRepository.update(id, movieData)
	}

	async deleteMovie(id: string): Promise<IMovie | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new AppError('Invalid movie ID format', 400)
		}

		return this.movieRepository.delete(id)
	}
}