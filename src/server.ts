import { app, initialize } from './app'

const PORT = process.env.PORT || 3000

initialize().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})
