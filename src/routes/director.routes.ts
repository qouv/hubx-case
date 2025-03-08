import { Router } from 'express'
import { DirectorController } from '../controllers/director.controller'

const router = Router()
const directorController = new DirectorController()

router.post('/', directorController.createDirector.bind(directorController))

export default router