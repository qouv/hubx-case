import mongoose, { ObjectId } from 'mongoose'
import { DirectorRepository } from '../../src/repositories/director.repository'
import { Director } from '../../src/models/director.model'

describe('Director Repository', () => {
	let repository: DirectorRepository

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/director-repository-testdb')
		repository = new DirectorRepository()
	})

	afterAll(async () => {
		await mongoose.connection.dropDatabase()
		await mongoose.connection.close()
	})

	afterEach(async () => {
		await Director.deleteMany({})
	})

	it('should create a director successfully', async () => {
		const directorData = {
			firstName: 'Christopher',
			secondName: 'Nolan',
			birthDate: new Date('1970-07-30'),
			bio: 'British-American film director',
		}

		const director = await repository.create(directorData)

		expect(director._id).toBeDefined()
		expect(director.firstName).toBe(directorData.firstName)
		expect(director.secondName).toBe(directorData.secondName)
		expect(director.birthDate).toEqual(directorData.birthDate)
		expect(director.bio).toBe(directorData.bio)
	})

	it('should find a director by ID', async () => {
		const directorData = {
			firstName: 'Ingmar',
			secondName: 'Bergman',
			birthDate: new Date('1918-07-14'),
			bio: 'Swedish film director, screenwriter, and producer',
		}
		const createdDirector = await repository.create(directorData)
		const createdDirectorId = (createdDirector._id as ObjectId).toString()

		await new Promise(resolve => setTimeout(resolve, 500))

		// Find by ID
		const foundDirector = await repository.findById(createdDirectorId)

		expect(foundDirector).not.toBeNull()
		expect((foundDirector!._id as ObjectId).toString()).toBe(createdDirectorId)
		expect(foundDirector!.firstName).toBe(directorData.firstName)
		expect(foundDirector!.secondName).toBe(directorData.secondName)
		expect(foundDirector!.birthDate).toEqual(directorData.birthDate)
		expect(foundDirector!.bio).toBe(directorData.bio)
	})

	it('should return null when finding a non-existent director ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const director = await repository.findById(nonExistentId)
		expect(director).toBeNull()
	})

	it('should delete a director by ID', async () => {
		// Create a director first
		const directorData = {
			firstName: 'Nuri Bilge',
			secondName: 'Ceylan',
			birthDate: new Date('1959-01-26'),
			bio: 'Turkish film director, screenwriter, and photographer',
		}
		const createdDirector = await repository.create(directorData)
		const createdDirectorId = (createdDirector._id as ObjectId).toString()

		// Delete the director
		await repository.delete(createdDirectorId)

		// Verify it no longer exists in the database
		const foundDirector = await repository.findById(createdDirectorId)
		expect(foundDirector).toBeNull()
	})

	it('should return null when deleting a non-existent director ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const deletedDirector = await repository.delete(nonExistentId)
		expect(deletedDirector).toBeNull()
	})
})