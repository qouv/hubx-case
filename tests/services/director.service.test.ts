import mongoose, { ObjectId } from 'mongoose'
import { DirectorService } from '../../src/services/director.service'
import { Director } from '../../src/models/director.model'

describe('Director Service', () => {
	let service: DirectorService

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/director-service-testdb')
		service = new DirectorService()
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

		const director = await service.createDirector(directorData)

		expect(director._id).toBeDefined()
		expect(director.firstName).toBe(directorData.firstName)
		expect(director.secondName).toBe(directorData.secondName)
		expect(director.birthDate).toEqual(directorData.birthDate)
		expect(director.bio).toBe(directorData.bio)
	})

	it('should get a director by ID', async () => {
		// Create a director first
		const directorData = {
			firstName: 'Martin',
			secondName: 'Scorsese',
			birthDate: new Date('1942-11-17'),
			bio: 'American film director, producer, screenwriter, and actor',
		}
		const createdDirector = await service.createDirector(directorData)
		const createdDirectorId = (createdDirector._id as ObjectId).toString()

		// Now get by ID
		const foundDirector = await service.getDirectorById(createdDirectorId)
		const foundDirectorId = (foundDirector?._id as ObjectId).toString()

		expect(foundDirector).not.toBeNull()
		expect(foundDirectorId).toBe(createdDirectorId)
		expect(foundDirector?.firstName).toBe(directorData.firstName)
	})

	it('should return null when getting a non-existent director ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const director = await service.getDirectorById(nonExistentId)
		expect(director).toBeNull()
	})

	it('should delete a director by ID', async () => {
		// Create a director first
		const directorData = {
			firstName: 'Quentin',
			secondName: 'Tarantino',
			birthDate: new Date('1963-03-27'),
			bio: 'American film director, screenwriter, producer, and actor',
		}
		const createdDirector = await service.createDirector(directorData)
		const createdDirectorId = (createdDirector._id as ObjectId).toString()

		// Now delete it
		const deletedDirector = await service.deleteDirector(createdDirectorId)
		const deletedDirectorId = (deletedDirector?._id as ObjectId).toString()

		// Verify it was deleted
		expect(deletedDirector).not.toBeNull()
		expect(deletedDirectorId).toBe(createdDirectorId)

		// Make sure it's actually gone from the database
		const directorAfterDeletion = await service.getDirectorById(createdDirectorId)
		expect(directorAfterDeletion).toBeNull()
	})

	it('should return null when deleting a non-existent director ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const result = await service.deleteDirector(nonExistentId)
		expect(result).toBeNull()
	})

	it('should throw an error when creating a director with invalid data', async () => {
		// Missing required fields
		const invalidDirectorData = {
			firstName: 'Steven'
			// Missing secondName, birthDate, and bio
		}

		await expect(
			service.createDirector(invalidDirectorData as any)
		).rejects.toThrow()
	})

	it('should handle invalid MongoDB ObjectIDs gracefully', async () => {
		// Invalid format for MongoDB ObjectID
		const invalidId = 'not-a-valid-id'

		await expect(
			service.getDirectorById(invalidId)
		).rejects.toThrow()

		await expect(
			service.deleteDirector(invalidId)
		).rejects.toThrow()
	})

	it('should validate director data before creating', async () => {
		const directorWithInvalidDate = {
			firstName: 'Stanley',
			secondName: 'Kubrick',
			birthDate: 'not-a-date', // Invalid date format
			bio: 'American film director, screenwriter, and producer',
		}

		await expect(
			service.createDirector(directorWithInvalidDate as any)
		).rejects.toThrow()
	})

	it('should create multiple directors and retrieve them independently', async () => {
		// Create multiple directors
		const director1Data = {
			firstName: 'Ruben',
			secondName: 'Ostlund',
			birthDate: new Date('1974-04-13'),
			bio: 'Swedish film director and screenwriter',
		}

		const director2Data = {
			firstName: 'Sean',
			secondName: 'Baker',
			birthDate: new Date('1971-02-26'),
			bio: 'American film director, producer, cinematographer, and screenwriter',
		}

		const director1 = await service.createDirector(director1Data)
		const director1Id = (director1._id as ObjectId).toString()
		const director2 = await service.createDirector(director2Data)
		const director2Id = (director2._id as ObjectId).toString()

		// Verify each director was created correctly
		expect(director1._id).not.toEqual(director2._id)

		const retrievedDirector1 = await service.getDirectorById(director1Id)
		const retrievedDirector2 = await service.getDirectorById(director2Id)

		expect(retrievedDirector1?.firstName).toBe(director1Data.firstName)
		expect(retrievedDirector2?.firstName).toBe(director2Data.firstName)
	})
})