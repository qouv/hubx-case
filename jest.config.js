module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	transform: {
	  '^.+\\.(ts|tsx)$': [
		'ts-jest',
		{
		  tsconfig: 'tsconfig.test.json'
		}
	  ]
	},
	testMatch: ['**/tests/**/*.test.(ts|js)'],
  }