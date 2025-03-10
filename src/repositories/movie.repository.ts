import { Movie, IMovie } from '../models/movie.model'

export class MovieRepository {
	async create(movieData: Partial<IMovie>): Promise<IMovie> {
		const movie = new Movie(movieData)

		return movie.save()
	}

	async findAll(): Promise<IMovie[]> {
		return Movie.find({}, '_id title description releaseDate genre rating imdbId')
			.populate('director', 'firstName secondName')
	}

	async findById(id: string): Promise<IMovie | null> {
		return Movie.findById(id, '_id title description releaseDate genre rating imdbId')
			.populate('director', 'firstName secondName')
	}

	async findByDirector(directorId: string): Promise<IMovie[]> {
		return Movie.find({ director: directorId }, '_id')
	}

	async update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
		return Movie.findByIdAndUpdate(id, movieData, { new: true, runValidators: true }).populate('director')
	}

	async delete(id: string): Promise<IMovie | null> {
		return Movie.findByIdAndDelete(id)
	}
}