import { Director, IDirector } from '../models/director.model'

export class DirectorRepository {
	async create(directorData: Partial<IDirector>): Promise<IDirector> {
		const director = new Director(directorData)

		return director.save()
	}

	async findById(id: string): Promise<IDirector | null> {
		return Director.findById(id)
	}

	async delete(id: string): Promise<IDirector | null> {
		return Director.findByIdAndDelete(id)
	}
}