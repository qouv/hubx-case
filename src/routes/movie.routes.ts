import { Router } from 'express'
import { MovieController } from '../controllers/movie.controller'

const router = Router()
const movieController = new MovieController()

router.post('/', (req, res, next) => movieController.createMovie(req, res, next))
router.get('/', (req, res, next) => movieController.getAllMovies(req, res, next))
router.put('/:id', (req, res, next) => movieController.updateMovie(req, res, next))
router.delete('/:id', (req, res, next) => movieController.deleteMovie(req, res, next))

export default router