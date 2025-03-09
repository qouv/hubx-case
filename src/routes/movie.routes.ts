import { Router } from 'express'
import { MovieController } from '../controllers/movie.controller'

const router = Router()
const movieController = new MovieController()

router.post('/', (req, res, next) => movieController.createMovie(req, res, next))

export default router