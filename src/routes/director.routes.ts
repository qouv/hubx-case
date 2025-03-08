import { Router } from 'express'
import { DirectorController } from '../controllers/director.controller'

const router = Router()
const directorController = new DirectorController()

router.post('/', (req, res, next) => directorController.createDirector(req, res, next))
router.delete('/:id', (req, res, next) => directorController.deleteDirector(req, res, next))

export default router