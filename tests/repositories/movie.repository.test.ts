import mongoose from 'mongoose'
import { MovieRepository } from '../../src/repositories/movie.repository'
import { Movie } from '../../src/models/movie.model'
import { Director } from '../../src/models/director.model'

describe('Movie Repository', () => {
	let repository: MovieRepository
	let directorId: mongoose.Types.ObjectId

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-repository-testdb')
		repository = new MovieRepository()

		// Create a director for reference
		const director = new Director({
			firstName: 'Wes',
			secondName: 'Anderson',
			birthDate: new Date('1969-05-01'),
			bio: 'American filmmaker known for his distinctive visual and narrative style',
		})
		const savedDirector = await director.save()
		directorId = savedDirector._id as mongoose.Types.ObjectId
	})

	afterAll(async () => {
		await mongoose.connection.dropDatabase()
		await mongoose.connection.close()
	})

	afterEach(async () => {
		await Movie.deleteMany({})
	})

	it('should create a movie successfully', async () => {
		const movieData = {
			title: 'The Grand Budapest Hotel',
			description: 'A writer encounters the owner of an aging high-class hotel',
			releaseDate: new Date('2014-03-28'),
			genre: ['Comedy', 'Drama'],
			rating: 8.1,
			imdbId: 'tt2278388',
			director: directorId,
		}

		const movie = await repository.create(movieData)

		expect(movie._id).toBeDefined()
		expect(movie.title).toBe(movieData.title)
		expect(movie.description).toBe(movieData.description)
		expect(movie.releaseDate).toEqual(movieData.releaseDate)
		expect(movie.genre).toEqual(expect.arrayContaining(movieData.genre))
		expect(movie.rating).toBe(movieData.rating)
		expect(movie.imdbId).toBe(movieData.imdbId)
		expect(movie.director.toString()).toBe(directorId.toString())
	})

	it('should find all movies', async () => {
		// Clear the collection before the test
		await Movie.deleteMany({})

		// Create test movies
		const movieData1 = {
			title: 'The Grand Budapest Hotel',
			description: 'A writer encounters the owner of an aging high-class hotel',
			releaseDate: new Date('2014-03-28'),
			genre: ['Comedy', 'Drama'],
			rating: 8.1,
			imdbId: 'tt2278388',
			director: directorId,
		}

		const movieData2 = {
			title: 'Moonrise Kingdom',
			description: 'A pair of young lovers flee their New England town',
			releaseDate: new Date('2012-05-25'),
			genre: ['Comedy', 'Drama', 'Romance'],
			rating: 7.8,
			imdbId: 'tt1748122',
			director: directorId,
		}

		// Create movies
		await repository.create(movieData1)
		await repository.create(movieData2)

		// Now find all movies
		const movies = await repository.findAll()

		expect(movies).toBeDefined()
		expect(Array.isArray(movies)).toBe(true)
		expect(movies.length).toBe(2)

		const titles = movies.map(m => m.title)
		expect(titles).toContain('The Grand Budapest Hotel')
		expect(titles).toContain('Moonrise Kingdom')
	})

	it('should find a movie by ID', async () => {
		// Create a movie first
		const movieData = {
			title: 'Fantastic Mr. Fox',
			description: 'An urbane fox cannot resist returning to his farm raiding ways and then must help his community survive the farmers\' retaliation',
			releaseDate: new Date('2009-11-25'),
			genre: [ 'Comedy' ],
			rating: 7.9,
			imdbId: 'tt0432283',
			director: directorId,
		}
		const createdMovie = await repository.create(movieData)

		const createdMovieId = (createdMovie._id as mongoose.Types.ObjectId).toString()

		// Now find by ID
		const foundMovie = await repository.findById(createdMovieId)

		const foundMovieId = (foundMovie?._id as mongoose.Types.ObjectId).toString()

		expect(foundMovie).not.toBeNull()
		expect(foundMovieId).toBe(createdMovieId)
		expect(foundMovie?.title).toBe(movieData.title)
	})

	it('should update a movie by ID', async () => {
		// Create a movie first
		const movieData = {
			title: 'The Royal Tenenbaums',
			description: 'The eccentric members of a dysfunctional family reluctantly gather under the same roof for various reasons',
			releaseDate: new Date('2001-12-14'),
			genre: ['Comedy', 'Drama'],
			rating: 7.6,
			imdbId: 'tt0265666',
			director: directorId,
		}
		const createdMovie = await repository.create(movieData)

		const createdMovieId = (createdMovie._id as mongoose.Types.ObjectId).toString()

		// Now update it
		const updateData = {
			rating: 7.7,
			description: 'Updated description for The Royal Tenenbaums',
		}
		const updatedMovie = await repository.update(createdMovieId, updateData)

		const updatedMovieId = (updatedMovie?._id as mongoose.Types.ObjectId).toString()

		expect(updatedMovie).not.toBeNull()
		expect(updatedMovieId).toBe(createdMovieId)
		expect(updatedMovie?.title).toBe(movieData.title) // Unchanged
		expect(updatedMovie?.rating).toBe(updateData.rating) // Updated
		expect(updatedMovie?.description).toBe(updateData.description) // Updated
	})

	it('should delete a movie by ID', async () => {
		// Create a movie first
		const movieData = {
			title: 'Isle of Dogs',
			description: 'Set in Japan, Isle of Dogs follows a boy\'s odyssey in search of his lost dog',
			releaseDate: new Date('2018-03-23'),
			genre: ['Comedy'],
			rating: 7.9,
			imdbId: 'tt5104604',
			director: directorId,
		}
		const createdMovie = await repository.create(movieData)

		const createdMovieId = (createdMovie._id as mongoose.Types.ObjectId).toString()

		// Now delete it
		const deletedMovie = await repository.delete(createdMovieId)

		const deletedMovieId = (deletedMovie?._id as mongoose.Types.ObjectId).toString()

		// Verify it was deleted
		expect(deletedMovie).not.toBeNull()
		expect(deletedMovieId).toBe(createdMovieId)

		// Verify it no longer exists in the database
		const foundMovie = await repository.findById(createdMovieId)
		expect(foundMovie).toBeNull()
	})

	it('should return null when finding a non-existent movie ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const movie = await repository.findById(nonExistentId)
		expect(movie).toBeNull()
	})

	it('should return null when updating a non-existent movie ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const updateData = { rating: 9.0 }
		const movie = await repository.update(nonExistentId, updateData)
		expect(movie).toBeNull()
	})

	it('should return null when deleting a non-existent movie ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const deletedMovie = await repository.delete(nonExistentId)
		expect(deletedMovie).toBeNull()
	})

	it('should return an empty array when no movies exist', async () => {
		// Ensure no movies exist
		await Movie.deleteMany({})

		const movies = await repository.findAll()
		expect(movies).toEqual([])
	})
})