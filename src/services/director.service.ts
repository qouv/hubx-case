import { DirectorRepository } from '../repositories/director.repository'
import { IDirector } from '../models/director.model'

export class DirectorService {
	private directorRepository: DirectorRepository;

	constructor() {
		this.directorRepository = new DirectorRepository()
	}

	async createDirector(directorData: Partial<IDirector>): Promise<IDirector> {
		return this.directorRepository.create(directorData)
	}
}