import mongoose from 'mongoose'
import { Movie } from '../../src/models/movie.model'
import { Director } from '../../src/models/director.model'

describe('Movie Model', () => {
	let directorId: mongoose.Types.ObjectId

	beforeAll(async () => {
		try {
			await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-model-testdb')
		} catch (error) {
			console.error('Error connecting to the database', error)
			process.exit(1)
		}


		// Create a director for reference
		const director = new Director({
			firstName: 'Martin',
			secondName: 'McDonagh',
			birthDate: new Date('1970-03-26'),
			bio: 'Irish-British playwright, screenwriter, producer, and director',
		})

		const savedDirector = await director.save() as mongoose.Document & { _id: mongoose.Types.ObjectId }

		directorId = savedDirector._id
	})

	afterAll(async () => {
		await mongoose.connection.dropDatabase()
		await mongoose.connection.close()
	})

	afterEach(async () => {
		await Movie.deleteMany({})
	})

	it('should create a new movie successfully', async () => {
		const movieData = {
			title: 'In Bruges',
			description: 'Guilt-stricken after a job gone wrong, hitman Ray and his partner await orders from their ruthless boss in Bruges, Belgium.',
			releaseDate: new Date('2008-02-08'),
			genre: ['Comedy', 'Drama'],
			rating: 7.9,
			imdbId: 'tt0780536',
			director: directorId,
		}

		const movie = new Movie(movieData)
		const savedMovie = await movie.save()

		expect(savedMovie._id).toBeDefined()
		expect(savedMovie.title).toBe(movieData.title)
		expect(savedMovie.description).toBe(movieData.description)
		expect(savedMovie.releaseDate).toEqual(movieData.releaseDate)
		expect(savedMovie.genre).toEqual(expect.arrayContaining(movieData.genre))
		expect(savedMovie.rating).toBe(movieData.rating)
		expect(savedMovie.imdbId).toBe(movieData.imdbId)
		expect(savedMovie.director.toString()).toBe(directorId.toString())
	})

	it('should fail to create a movie without required fields', async () => {
		const invalidMovie = new Movie({
			title: 'Banshees of Inisherin',
			// Missing other required fields
		})

		let error
		try {
			await invalidMovie.save()
		} catch (err) {
			error = err
		}

		expect(error).toBeDefined()

		if (error instanceof mongoose.Error.ValidationError) {
			expect(error.errors.description).toBeDefined()
			expect(error.errors.releaseDate).toBeDefined()
			expect(error.errors.rating).toBeDefined()
			expect(error.errors.imdbId).toBeDefined()
			expect(error.errors.director).toBeDefined()
		} else {
			throw error
		}
	})

	it('should fail to create a movie with invalid rating (> 10)', async () => {
		const movieData = {
			title: 'Banshees of Inisherin',
			description: 'Two lifelong friends find themselves at an impasse when one abruptly ends their relationship, with alarming consequences for both of them.',
			releaseDate: new Date('2022-10-21'),
			genre: ['Drama', 'Comedy'],
			rating: 11, // Invalid rating > 10
			imdbId: 'tt11813216',
			director: directorId,
		}

		const movie = new Movie(movieData)

		let error
		try {
			await movie.save()
		} catch (err) {
			error = err
		}

		expect(error).toBeDefined()

		if (error instanceof mongoose.Error.ValidationError) {
			expect(error.errors.rating).toBeDefined()
		}else {
			throw error
		}
	})

	it('should fail to create a movie with invalid rating (< 0)', async () => {
		const movieData = {
			title: 'Three Billboards Outside Ebbing, Missouri',
			description: 'A mother personally challenges the local authorities to solve her daughter\'s murder when they fail to catch the culprit.',
			releaseDate: new Date('2017-11-10'),
			genre: ['Crime', 'Drama'],
			rating: -1, // Invalid rating < 0
			imdbId: 'tt5027774',
			director: directorId,
		}

		const movie = new Movie(movieData)

		let error
		try {
			await movie.save()
		} catch (err) {
			error = err
		}

		expect(error).toBeDefined()

		if (error instanceof mongoose.Error.ValidationError) {
			expect(error.errors.rating).toBeDefined()
		} else {
			throw error
		}
	})

	it('should fail to create a movie with duplicate imdbId', async () => {
		// Create first movie
		const firstMovie = new Movie({
			title: 'Three Billboards Outside Ebbing, Missouri',
			description: 'A mother personally challenges the local authorities to solve her daughter\'s murder when they fail to catch the culprit.',
			releaseDate: new Date('2017-11-10'),
			genre: ['Drama'],
			rating: 8.2,
			imdbId: 'tt5027774',
			director: directorId,
		})
		await firstMovie.save()

		// Try to create second movie with same imdbId
		const secondMovie = new Movie({
			title: 'Different Movie',
			description: 'Different description',
			releaseDate: new Date('2020-01-01'),
			genre: ['Drama'],
			rating: 7.5,
			imdbId: 'tt5027774', // Same imdbId
			director: directorId,
		})

		let error
		try {
			await secondMovie.save()
		} catch (err) {
			error = err
		}

		expect(error).toBeDefined()
		if (!(error instanceof mongoose.MongooseError)) {
			throw error
		}
	})
})