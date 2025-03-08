export class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const handleError = (error: unknown): { message: string; statusCode: number; details?: any } => {
	if (error instanceof AppError) {
		return {
			message: error.message,
			statusCode: error.statusCode,
		};
	}

	if (error instanceof Error) {
		if (error.name === "ValidationError") {
			// Extract and format validation error messages from Mongoose
			const errors = Object.fromEntries(
				Object.entries((error as any).errors).map(([key, value]) => [key, (value as { message: string }).message.replace(/^Path `|`/g, "").trim()])
			);

			return {
				message: "Validation failed",
				statusCode: 400,
				details: errors,
			};
		}


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