import { Movie, IMovie } from '../models/movie.model'

export class MovieRepository {
	async create(movieData: Partial<IMovie>): Promise<IMovie> {
		const movie = new Movie(movieData)
		return movie.save()
	}

	async findAll(): Promise<IMovie[]> {
		return Movie.find().populate('director')
	}

	async findById(id: string): Promise<IMovie | null> {
		return Movie.findById(id).populate('director')
	}

	async update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
		return Movie.findByIdAndUpdate(id, movieData, { new: true }).populate('director')
	}

	async delete(id: string): Promise<IMovie | null> {
		return Movie.findByIdAndDelete(id)
	}
}