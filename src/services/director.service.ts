import { DirectorRepository } from '../repositories/director.repository'
import { MovieRepository } from '../repositories/movie.repository'
import { IDirector } from '../models/director.model'
import { formatName } from '../utils/format.utils'
import { AppError } from '../utils/error.utils'
import mongoose from 'mongoose'

export class DirectorService {
	private directorRepository: DirectorRepository
	private movieRepository: MovieRepository

	constructor() {
		this.directorRepository = new DirectorRepository()
		this.movieRepository = new MovieRepository()
	}

	async createDirector(directorData: Partial<IDirector>): Promise<IDirector> {
		if (directorData.firstName) {
			directorData.firstName = formatName(directorData.firstName)
		}

		if (directorData.secondName) {
			directorData.secondName = formatName(directorData.secondName)
		}

		return this.directorRepository.create(directorData)
	}

	async deleteDirector(id: string): Promise<IDirector | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new AppError('Invalid director ID format', 400)
		}

		// Check if any movies are associated with this director
		const movies = await this.movieRepository.findByDirector(id)

		if (movies.length > 0) {
			throw new AppError("Cannot delete director with associated movies.", 409)
		}

		return this.directorRepository.delete(id)
	}

	async getDirectorById(id: string): Promise<IDirector | null> {
		return this.directorRepository.findById(id)
	}
}