export function interval(a: number, b: number): number[] {
	const result: number[] = []
	for (let i = a; i <= b; i++) {
		result.push(i)
	}
	return result
}

export function rand_int(a: number, b: number): number {
	return Math.floor(a + Math.random() * (b - a))
}
