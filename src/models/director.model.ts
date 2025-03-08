import mongoose, { Document, Schema } from 'mongoose';

export interface IDirector extends Document {
	firstName: string;
	secondName: string;
	birthDate: Date;
	bio: string;
}

const directorSchema = new Schema<IDirector>({
	firstName: { type: String, required: true },
	secondName: { type: String, required: true },
	birthDate: { type: Date, required: true },
	bio: { type: String, required: true },
}, { timestamps: true });

export const Director = mongoose.model<IDirector>('Director', directorSchema);