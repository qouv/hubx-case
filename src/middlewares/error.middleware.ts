import { Request, Response, NextFunction } from 'express'
import { handleError } from '../utils/error.utils'

export const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	const { message, statusCode } = handleError(error)
	res.status(statusCode).json({ message })
};