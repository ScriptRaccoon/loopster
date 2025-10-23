export class AsyncQueue<T> {
	private queue: T[] = []
	private processing = false

	constructor(private execute_task: (item: T) => Promise<void>) {}

	enqueue(item: T) {
		this.queue.push(item)
		if (!this.processing) {
			void this.process_next()
		}
	}

	private async process_next() {
		if (this.processing) return
		this.processing = true
		while (this.queue.length > 0) {
			const item = this.queue.shift()!
			await this.execute_task(item)
		}
		this.processing = false
	}
}
