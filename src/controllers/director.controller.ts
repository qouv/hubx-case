import { Request, Response, NextFunction } from 'express'
import { DirectorService } from '../services/director.service'

export class DirectorController {
	private directorService: DirectorService

	constructor() {
		this.directorService = new DirectorService()
	}

	async createDirector(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const director = await this.directorService.createDirector(req.body)

			res.status(201).json(director)
		} catch (error) {
			next(error)
		}
	}

	async deleteDirector(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.directorService.deleteDirector(req.params.id)

			res.sendStatus(204)
		} catch (error) {
			next(error)
		}
	}
}
