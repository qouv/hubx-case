import mongoose, { Document, Schema } from 'mongoose'

export interface IDirector extends Document {
	firstName: string;
	secondName: string;
	birthDate: Date;
	bio: string;
	createdAt?: Date,
	updatedAt?: Date
}

const directorSchema = new Schema<IDirector>({
	firstName: {
		type: String,
		required: [true, 'First name is required'],
		match: [/^[A-Za-z\s-]{2,50}$/, 'First name must contain only letters, spaces, or hyphens and be 2-50 characters long']
	},
	secondName: {
		type: String,
		required: [true, 'Second name is required'],
		maxlength: [64, 'Second name cannot be more than 64 characters'],
		match: [/^[A-Za-z\s-]{2,50}$/, 'Second name must contain only letters, spaces, or hyphens and be 2-50 characters long']

	},
	birthDate: {
		type: Date,
		required: [true, 'Birth date is required'],
		validate: [
			{
				validator: function(value: Date) {
					// Ensure birthDate is not in the future
					return value <= new Date();
				},
				message: 'Birth date cannot be in the future'
			}
		]
	},
	bio: {
		type: String,
		required: [true, 'Bio is required'],
		maxLength: [400, 'Bio cannot be more than 400 characters']
	}
}, { timestamps: true })

export const Director = mongoose.model<IDirector>('Director', directorSchema);