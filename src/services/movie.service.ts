import { MovieRepository } from '../repositories/movie.repository'
import { DirectorService } from './director.service'
import { IMovie } from '../models/movie.model'

export class MovieService {
	private movieRepository: MovieRepository
	private directorService: DirectorService

	constructor() {
		this.movieRepository = new MovieRepository()
		this.directorService = new DirectorService()
	}

	async createMovie(movieData: Partial<IMovie>): Promise<IMovie> {
		// Verify director exists
		if (movieData.director) {
			const directorId = movieData.director.toString()

			const director = await this.directorService.getDirectorById(directorId)
			if (!director) {
				throw new Error('Director not found')
			}
		}

		return this.movieRepository.create(movieData)
	}
}