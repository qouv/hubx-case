import mongoose, { ObjectId } from 'mongoose'
import { MovieService } from '../../src/services/movie.service'
import { DirectorService } from '../../src/services/director.service'
import { Movie } from '../../src/models/movie.model'
import { Director } from '../../src/models/director.model'

describe('Movie Service', () => {
	let movieService: MovieService
	let directorService: DirectorService
	let testDirectorId: mongoose.Types.ObjectId

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-service-testdb')
		movieService = new MovieService()
		directorService = new DirectorService()

		// Create a test director to use in movie tests
		const directorData = {
			firstName: 'Martin',
			secondName: 'McDonagh',
			birthDate: new Date('1970-03-26'),
			bio: 'Martin McDonagh is an Irish playwright, screenwriter, producer, and director.'
		}
		const director = await directorService.createDirector(directorData)
		testDirectorId = director._id as mongoose.Types.ObjectId
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
			title: 'In Bruges',
			description: 'Guilt-stricken after a job gone wrong, hitman Ray and his partner await orders from their ruthless boss in Bruges, Belgium.',
			releaseDate: new Date('2008-02-08'),
			genre: [ 'Comedy', 'Drama' ],
			rating: 7.9,
			imdbId: 'tt0780536',
			director: testDirectorId
		}

		const movie = await movieService.createMovie(movieData)

		expect(movie._id).toBeDefined()
		expect(movie.title).toBe(movieData.title)
		expect(movie.description).toBe(movieData.description)
		expect(movie.releaseDate).toEqual(movieData.releaseDate)
		expect(movie.genre).toEqual(expect.arrayContaining(movieData.genre))
		expect(movie.rating).toBe(movieData.rating)
		expect(movie.imdbId).toBe(movieData.imdbId)
		expect(movie.director.toString()).toBe(testDirectorId.toString())
	})

	it('should get all movies', async () => {
		// Create multiple movies
		const movieData1 = {
			title: 'Three Billboards Outside Ebbing, Missouri',
			description: 'A mother personally challenges the local authorities to solve her daughter\'s murder when they fail to catch the culprit.',
			releaseDate: new Date('2017-11-10'),
			genre: [ 'Drama' ],
			rating: 8.1,
			imdbId: 'tt5027774',
			director: testDirectorId
		}

		const movieData2 = {
			title: 'Seven Psychopaths',
			description: 'A struggling screenwriter inadvertently becomes entangled in the Los Angeles criminal underworld after his oddball friends kidnap a gangster\'s beloved Shih Tzu.',
			releaseDate: new Date('2012-10-12'),
			genre: [ 'Comedy' ],
			rating: 7.2,
			imdbId: 'tt1931533',
			director: testDirectorId
		}

		await movieService.createMovie(movieData1)
		await movieService.createMovie(movieData2)

		const movies = await movieService.getAllMovies()

		expect(movies).toHaveLength(2)
		expect(movies[0].title).toBeDefined()
		expect(movies[1].title).toBeDefined()
		expect(movies.map(m => m.title)).toContain('Three Billboards Outside Ebbing, Missouri')
		expect(movies.map(m => m.title)).toContain('Seven Psychopaths')
	})

	it('should update a movie successfully', async () => {
		// Create a movie first
		const movieData = {
			title: 'The Banshees of Inisherin',
			description: 'Two lifelong friends find themselves at an impasse when one abruptly ends their relationship, with alarming consequences for both of them.',
			releaseDate: new Date('2022-10-21'),
			genre: ['Comedy', 'Drama'],
			rating: 7.7,
			imdbId: 'tt11813216',
			director: testDirectorId
		}

		const createdMovie = await movieService.createMovie(movieData)
		const createdMovieId = (createdMovie._id as ObjectId).toString()

		// Update data
		const updateData = {
			rating: 8.0,
			description: 'Updated description for The Banshees of Inisherin'
		}

		const updatedMovie = await movieService.updateMovie(createdMovieId, updateData)

		expect(updatedMovie).not.toBeNull()
		expect(updatedMovie?.title).toBe(movieData.title) // Unchanged field
		expect(updatedMovie?.description).toBe(updateData.description) // Updated field
		expect(updatedMovie?.rating).toBe(updateData.rating) // Updated field
	})

	it('should return null when updating a non-existent movie ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const updateData = { title: 'This movie does not exist' }

		const result = await movieService.updateMovie(nonExistentId, updateData)
		expect(result).toBeNull()
	})

	it('should delete a movie by ID', async () => {
		// Create a movie first
		const movieData = {
			title: 'The Guard',
			description: 'An unorthodox Irish policeman with a confrontational personality is partnered with an up-tight F.B.I. agent to investigate an international drug-smuggling ring.',
			releaseDate: new Date('2011-07-07'),
			genre: ['Comedy', 'Thriller'],
			rating: 7.3,
			imdbId: 'tt1540133',
			director: testDirectorId
		}

		const createdMovie = await movieService.createMovie(movieData)
		const createdMovieId = (createdMovie._id as ObjectId).toString()

		// Now delete it
		const deletedMovie = await movieService.deleteMovie(createdMovieId)
		const deletedMovieId = (deletedMovie?._id as ObjectId).toString()

		// Verify it was deleted
		expect(deletedMovie).not.toBeNull()
		expect(deletedMovieId).toBe(createdMovieId)

		// Make sure it's actually gone from the database
		const movies = await movieService.getAllMovies()
		expect(movies).toHaveLength(0)
	})

	it('should return null when deleting a non-existent movie ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const result = await movieService.deleteMovie(nonExistentId)
		expect(result).toBeNull()
	})

	it('should throw an error when creating a movie with invalid data', async () => {
		// Missing required fields
		const invalidMovieData = {
			title: 'Incomplete Movie'
			// Missing description, releaseDate, genre, rating, imdbId, director
		}

		await expect(
			movieService.createMovie(invalidMovieData as any)
		).rejects.toThrow()
	})

	it('should throw an error when creating a movie with non-existent director', async () => {
		const nonExistentDirectorId = new mongoose.Types.ObjectId()

		const movieData = {
			title: 'Movie With Invalid Director',
			description: 'This movie has a director that does not exist',
			releaseDate: new Date('2023-01-01'),
			genre: ['Drama'],
			rating: 7.5,
			imdbId: 'tt9999999',
			director: nonExistentDirectorId
		}

		await expect(
			movieService.createMovie(movieData)
		).rejects.toThrow('Director not found')
	})

	it('should handle invalid MongoDB ObjectIDs gracefully', async () => {
		// Invalid format for MongoDB ObjectID
		const invalidId = 'not-a-valid-id'

		await expect(
			movieService.updateMovie(invalidId, { title: 'Test' })
		).rejects.toThrow()

		await expect(
			movieService.deleteMovie(invalidId)
		).rejects.toThrow()
	})

	it('should validate movie data before creating', async () => {
		const movieWithInvalidRating = {
			title: 'Invalid Rating Movie',
			description: 'This movie has an invalid rating',
			releaseDate: new Date('2023-01-01'),
			genre: ['Drama'],
			rating: 11, // Rating should be 0-10
			imdbId: 'tt8888888',
			director: testDirectorId
		}

		await expect(
			movieService.createMovie(movieWithInvalidRating as any)
		).rejects.toThrow()
	})

	it('should populate director information when getting movies', async () => {
		// Create a movie
		const movieData = {
			title: 'Birdman',
			description: 'A washed-up superhero actor attempts to revive his career',
			releaseDate: new Date('2014-10-17'),
			genre: ['Comedy', 'Drama'],
			rating: 7.7,
			imdbId: 'tt2562232',
			director: testDirectorId
		}

		await movieService.createMovie(movieData)

		// Get all movies
		const movies = await movieService.getAllMovies()

		expect(movies).toHaveLength(1)

		// Check if director is populated
		const movie = movies[0]
		expect(movie.director).toBeDefined()

		// This test depends on how your implementation handles population
		// If returning a full Director object:
		if (typeof movie.director !== 'string') {
			expect(movie.director).toHaveProperty('firstName')
			expect(movie.director).toHaveProperty('secondName')
		}
	})

	it('should create movies with different IMDb IDs', async () => {
		// First movie
		const movieData1 = {
			title: 'The Matrix',
			description: 'A computer hacker learns about the true nature of reality',
			releaseDate: new Date('1999-03-31'),
			genre: ['Action' ],
			rating: 8.7,
			imdbId: 'tt0133093',
			director: testDirectorId
		}

		// Second movie with same title but different IMDb ID
		const movieData2 = {
			title: 'The Matrix',
			description: 'A remake with the same title',
			releaseDate: new Date('2021-12-22'),
			genre: ['Action' ],
			rating: 5.7,
			imdbId: 'tt10838180', // Different IMDb ID
			director: testDirectorId
		}

		const movie1 = await movieService.createMovie(movieData1)
		const movie2 = await movieService.createMovie(movieData2)

		expect(movie1.imdbId).not.toBe(movie2.imdbId)
		expect(movie1.title).toBe(movie2.title) // Same title is fine
	})

	it('should throw an error when creating a movie with duplicate IMDb ID', async () => {
		// First movie
		const movieData1 = {
			title: 'The Shawshank Redemption',
			description: 'Two imprisoned men bond over a number of years',
			releaseDate: new Date('1994-09-23'),
			genre: ['Drama'],
			rating: 9.3,
			imdbId: 'tt0111161',
			director: testDirectorId
		}

		// Second movie with same IMDb ID
		const movieData2 = {
			title: 'Different Movie',
			description: 'But with same IMDb ID as Shawshank',
			releaseDate: new Date('2023-01-01'),
			genre: ['Drama'],
			rating: 6.0,
			imdbId: 'tt0111161', // Same IMDb ID
			director: testDirectorId
		}

		await movieService.createMovie(movieData1)

		// This should fail because IMDb ID must be unique
		await expect(
			movieService.createMovie(movieData2)
		).rejects.toThrow()
	})

	it('should partial update only provided fields', async () => {
		// Create original movie
		const originalMovie = {
			title: 'Original Title',
			description: 'Original description',
			releaseDate: new Date('2020-01-01'),
			genre: ['Drama'],
			rating: 7.0,
			imdbId: 'tt7777777',
			director: testDirectorId
		}

		const createdMovie = await movieService.createMovie(originalMovie)
		const movieId = (createdMovie._id as ObjectId).toString()

		// Partial update - only update title
		const partialUpdate = {
			title: 'Updated Title'
		}

		const updatedMovie = await movieService.updateMovie(movieId, partialUpdate)

		// Verify only the title changed, other fields remained the same
		expect(updatedMovie?.title).toBe('Updated Title')
		expect(updatedMovie?.description).toBe(originalMovie.description)
		expect(updatedMovie?.rating).toBe(originalMovie.rating)
		expect(updatedMovie?.imdbId).toBe(originalMovie.imdbId)
	})

	it('should handle concurrent operations correctly', async () => {
		// Create a movie
		const movieData = {
			title: 'Concurrent Test Movie',
			description: 'Testing concurrent operations',
			releaseDate: new Date('2022-01-01'),
			genre: [ 'Comedy' ],
			rating: 5.0,
			imdbId: 'tt6666666',
			director: testDirectorId
		}

		const movie = await movieService.createMovie(movieData)
		const movieId = (movie._id as ObjectId).toString()

		// Perform multiple update operations concurrently
		const update1 = { rating: 6.0 }
		const update2 = { rating: 7.0 }

		await Promise.all([
			movieService.updateMovie(movieId, update1),
			movieService.updateMovie(movieId, update2)
		])

		// One of the updates should win (may vary based on implementation)
		const finalMovie = await Movie.findById(movieId)
		expect(finalMovie).not.toBeNull()
		expect([6.0, 7.0]).toContain(finalMovie?.rating)
	})
})