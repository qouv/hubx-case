import mongoose from 'mongoose'
import { Director } from '../../src/models/director.model'

describe('Director Model', () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/director-model-testdb')
	})

	afterAll(async () => {
		await mongoose.connection.dropDatabase()
		await mongoose.connection.close()
	})

	afterEach(async () => {
		await Director.deleteMany({})
	})

	it('should create a new director successfully', async () => {
		const directorData = {
			firstName: 'Martin',
			secondName: 'McDonagh',
			birthDate: new Date('1970-03-26'),
			bio: 'Irish-British playwright, screenwriter, producer, and director',
		}

		const director = new Director(directorData)
		const savedDirector = await director.save()

		expect(savedDirector._id).toBeDefined()
		expect(savedDirector.firstName).toBe(directorData.firstName)
		expect(savedDirector.secondName).toBe(directorData.secondName)
		expect(savedDirector.birthDate).toEqual(directorData.birthDate)
		expect(savedDirector.bio).toBe(directorData.bio)
	})

	it('should fail to create a director without required fields', async () => {
		const invalidDirector = new Director({
			firstName: 'Christopher',
			// Missing secondName, birthDate, bio
		})

		let error
		try {
			await invalidDirector.save()
		} catch (err) {
			error = err
		}

		expect(error).toBeDefined()

		if (error instanceof mongoose.Error.ValidationError) {
			expect(error.errors.secondName).toBeDefined()
			expect(error.errors.birthDate).toBeDefined()
			expect(error.errors.bio).toBeDefined()
		} else {
			throw error
		}
	})

	it('should create timestamps when a director is created', async () => {
		const director = new Director({
			firstName: 'Thomas',
			secondName: 'Vinterberg',
			birthDate: new Date('1969-05-19'),
			bio: 'Danish film director, screenwriter, and producer',
		})

		const savedDirector = await director.save()

		expect(savedDirector.createdAt).toBeDefined()
		expect(savedDirector.updatedAt).toBeDefined()
	})
})