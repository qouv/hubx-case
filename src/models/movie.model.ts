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

const validGenres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Western']

const movieSchema = new Schema<IMovie>({
	title: { type: String, required: [true, 'Title is required'] },
	description: { type: String, required: [true, 'Description is required'] },
	releaseDate: { type: Date, required: [true, 'Release date is required'] },
	genre: [{ type: String, required: [true, 'Genre is required'], enum: validGenres }],
	rating: { type: Number, required: [true, 'Rating is required'], min: 0, max: 10 },
	imdbId: {
		type: String,
		required: [true, 'IMDB ID is required'],
		unique: [true, 'IMDB ID must be unique'],
		match: [/^tt\d{7,10}$/, 'IMDB ID must match the pattern tt followed by 7 to 10 digits']
	},
	director: { type: Schema.Types.ObjectId, ref: 'Director', required: [true, 'Director is required'] }
}, { timestamps: true })

export const Movie = mongoose.model<IMovie>('Movie', movieSchema)