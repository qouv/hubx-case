import { Router } from 'express'
import { MovieController } from '../controllers/movie.controller'
import { cache, invalidateCache } from '../middlewares/cache.middleware'


const router = Router()
const movieController = new MovieController()

router.post('/', invalidateCache(['GET:*']), (req, res, next) => movieController.createMovie(req, res, next))
router.get('/', cache({ ttl: 600 }), (req, res, next) => movieController.getAllMovies(req, res, next))
router.put('/:id', invalidateCache(['GET:*']), (req, res, next) => movieController.updateMovie(req, res, next))
router.delete('/:id', invalidateCache(['GET:*']), (req, res, next) => movieController.deleteMovie(req, res, next))

export default router