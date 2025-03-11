export function formatName(name: string): string {
	return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export function formatMovieName(name: string): string {
	return name.split(' ').map(word => formatName(word)).join(' ')
}