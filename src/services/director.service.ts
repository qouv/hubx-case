import { DirectorRepository } from '../repositories/director.repository'
import { IDirector } from '../models/director.model'
import { formatName } from '../utils/format.utils'

export class DirectorService {
	private directorRepository: DirectorRepository

	constructor() {
		this.directorRepository = new DirectorRepository()
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
		return this.directorRepository.delete(id)
	  }
}