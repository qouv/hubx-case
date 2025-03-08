import mongoose, { Document, Schema } from 'mongoose';
import { IDirector } from './director.model';

export interface IMovie extends Document {
	title: string;
	description: string;
	releaseDate: Date;
	genre: string[];
	rating: number;
	imdbId: string;
	director: mongoose.Types.ObjectId | IDirector;
}

const movieSchema = new Schema<IMovie>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	releaseDate: { type: Date, required: true },
	genre: [{ type: String, required: true }],
	rating: { type: Number, required: true, min: 0, max: 10 },
	imdbId: { type: String, required: true, unique: true },
	director: { type: Schema.Types.ObjectId, ref: 'Director', required: true }
}, { timestamps: true });

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);