export class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const handleError = (error: unknown): { message: string; statusCode: number } => {
	if (error instanceof AppError) {
		return {
			message: error.message,
			statusCode: error.statusCode,
		};
	}

	if (error instanceof Error) {
		return {
			message: error.message,
			statusCode: 400,
		};
	}

	return {
		message: 'An unexpected error occurred',
		statusCode: 500,
	};
};