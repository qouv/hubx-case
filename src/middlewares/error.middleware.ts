import { Request, Response, NextFunction } from 'express'
import { handleError } from '../utils/error.utils'

const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	const { message, statusCode, details } = handleError(error)
	res.status(statusCode).json({ message, details })
};

export default errorMiddleware