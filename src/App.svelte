<script lang="ts">
	import { interval, rand_int } from './utils'

	let square_size = $state(7)
	let move_size = $state(2)

	type Piece = {
		readonly id: string
		readonly original_x: number
		readonly original_y: number
		readonly label: string
		readonly hue: number
		dx: number
		dy: number
	}

	let piece_grid = $state<Piece[][]>(get_initial_grid())
	let move_history: [number, number, boolean][] = []
	let square_element = $state<HTMLDivElement | null>(null)
	let animating = $state(false)

	function get_initial_grid() {
		const grid: Piece[][] = []

		for (let y = 0; y < square_size; y++) {
			grid[y] ??= []
			for (let x = 0; x < square_size; x++) {
				const id = crypto.randomUUID()
				const index = y * square_size + x + 1
				const label = index.toString()
				const hue = ((index - 1) / square_size ** 2) * 360
				const dx = 0
				const dy = 0
				grid[y][x] = { id, original_x: x, original_y: y, label, hue, dx, dy }
			}
		}

		return grid
	}

	let solved_coordinates = $derived.by(() => {
		const coords = []
		for (let y = 0; y < square_size; y++) {
			for (let x = 0; x < square_size; x++) {
				const piece = piece_grid[y][x]
				const is_solved = piece.original_x === x && piece.original_y === y
				if (is_solved) coords.push([y, x])
			}
		}
		return coords
	})

	let percentage_solved_pieces = $derived(
		Math.floor(100 * (solved_coordinates.length / square_size ** 2)),
	)

	function is_clickble(y: number, x: number) {
		return Math.max(x, y) <= square_size - move_size - 1
	}

	function handle_click(y: number, x: number, shiftkey: boolean) {
		if (animating) return
		if (!is_clickble(y, x)) return

		if (shiftkey) {
			move_pieces_anticlockwise(y, x)
		} else {
			move_pieces_clockwise(y, x)
		}
	}

	function move_pieces_clockwise(
		y: number,
		x: number,
		options = {
			record_move: true,
			animated: true,
		},
	) {
		const updates: [number, number, Piece][] = []

		for (let u = x; u < x + move_size; u++) {
			const piece = piece_grid[y][u]
			piece.dx = 1
			updates.push([y, u, piece])
		}

		for (let v = y; v < y + move_size; v++) {
			const piece = piece_grid[v][x + move_size]
			piece.dy = 1
			updates.push([v, x + move_size, piece])
		}

		for (let u = x + move_size; u > x; u--) {
			const piece = piece_grid[y + move_size][u]
			piece.dx = -1
			updates.push([y + move_size, u, piece])
		}

		for (let v = y + move_size; v > y; v--) {
			const piece = piece_grid[v][x]
			piece.dy = -1
			updates.push([v, x, piece])
		}

		if (options.animated) {
			animate_move(updates)
		} else {
			execute_move(updates)
		}

		if (options.record_move) move_history.push([y, x, true])
	}

	function move_pieces_anticlockwise(
		y: number,
		x: number,
		options = {
			record_move: true,
			animated: true,
		},
	) {
		const updates: [number, number, Piece][] = []

		for (let u = x + 1; u <= x + move_size; u++) {
			const piece = piece_grid[y][u]
			piece.dx = -1
			updates.push([y, u, piece])
		}

		for (let v = y + 1; v <= y + move_size; v++) {
			const piece = piece_grid[v][x + move_size]
			piece.dy = -1
			updates.push([v, x + move_size, piece])
		}

		for (let u = x + move_size - 1; u >= x; u--) {
			const piece = piece_grid[y + move_size][u]
			piece.dx = 1
			updates.push([y + move_size, u, piece])
		}

		for (let v = y + move_size - 1; v >= y; v--) {
			const piece = piece_grid[v][x]
			piece.dy = 1
			updates.push([v, x, piece])
		}

		if (options.animated) {
			animate_move(updates)
		} else {
			execute_move(updates)
		}

		if (options.record_move) move_history.push([y, x, false])
	}

	function animate_move(updates: [number, number, Piece][]) {
		animating = true
		square_element?.addEventListener(
			'transitionend',
			() => {
				animating = false
				execute_move(updates)
			},
			{ once: true },
		)
	}

	function execute_move(updates: [number, number, Piece][]) {
		for (const [v, u, piece] of updates) {
			piece_grid[v + piece.dy][u + piece.dx] = piece
			piece.dx = 0
			piece.dy = 0
		}
	}

	function reset_pieces() {
		let updates: [number, number, Piece][] = []

		for (let y = 0; y < square_size; y++) {
			for (let x = 0; x < square_size; x++) {
				const piece = piece_grid[y][x]
				updates.push([piece.original_y, piece.original_x, piece])
			}
		}

		for (const [v, u, piece] of updates) {
			piece_grid[v][u] = piece
			piece.dx = 0
			piece.dy = 0
		}

		move_history = []
	}

	function scramble_pieces(move_count = 100 * square_size) {
		if (animating) return

		reset_pieces()

		for (let i = 0; i < move_count; i++) {
			const y = rand_int(0, square_size - move_size)
			const x = rand_int(0, square_size - move_size)
			const clockwise = Math.random() < 0.5

			if (clockwise) {
				move_pieces_clockwise(y, x, { record_move: false, animated: false })
			} else {
				move_pieces_anticlockwise(y, x, { record_move: false, animated: false })
			}
		}
	}

	function undo_move() {
		if (animating) return

		const last_move = move_history.pop()
		if (!last_move) return

		const [y, x, clockwise] = last_move

		if (clockwise) {
			move_pieces_anticlockwise(y, x, {
				record_move: false,
				animated: true,
			})
		} else {
			move_pieces_clockwise(y, x, {
				record_move: false,
				animated: true,
			})
		}
	}

	function change_size(e: Event & { currentTarget: HTMLSelectElement }) {
		if (animating) return
		square_size = Number(e.currentTarget.value)
		move_size = Math.min(move_size, square_size - 1)
		piece_grid = get_initial_grid()
	}
</script>

<header>
	<h1>Loopster</h1>
</header>

<div class="wrapper">
	<div class="progress" style:--percentage={percentage_solved_pieces}>
		<div class="bar" aria-hidden="true"></div>
		<div class="percentage" title="Percentage of solved pieces">
			{percentage_solved_pieces}%
		</div>
	</div>

	<div
		class="square"
		style:--size={square_size}
		bind:this={square_element}
		class:animating
	>
		{#each { length: square_size } as _, y}
			{#each { length: square_size } as _, x}
				{@const piece = piece_grid[y][x]}
				<button
					class="piece"
					onclick={(e) => handle_click(y, x, e.shiftKey)}
					style:--hue={piece.hue}
					style:--dx={piece.dx}
					style:--dy={piece.dy}
					disabled={!is_clickble(y, x)}
				>
					{piece.label}
				</button>
			{/each}
		{/each}
	</div>

	<menu>
		<button class="btn" onclick={reset_pieces}>Reset</button>
		<button class="btn" onclick={() => scramble_pieces()}>Scramble</button>
		<button class="btn" onclick={() => undo_move()}>Undo</button>
	</menu>

	<section>
		<h2>Settings</h2>

		<p>Caution: Updating these settings will reset the game.</p>

		<div class="setting">
			<label for="move-size-select">Move Size</label>
			<select
				id="move-size-select"
				bind:value={move_size}
				onchange={reset_pieces}
				disabled={animating}
			>
				{#each interval(1, square_size - 1) as val}
					<option value={val}>{val}</option>
				{/each}
			</select>
		</div>

		<div class="setting">
			<label for="board-size-select">Board Size</label>
			<select
				id="board-size-select"
				value={square_size}
				onchange={change_size}
				disabled={animating}
			>
				{#each interval(2, 10) as val}
					<option value={val}>{val}</option>
				{/each}
			</select>
		</div>
	</section>
</div>

<style>
	header {
		margin-block: 2rem;
		text-align: center;
	}

	.wrapper {
		width: min(90vw, 600px);
		margin-inline: auto;
	}

	.progress {
		margin-block: 1rem 0.25rem;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 1rem;

		.bar {
			width: calc(var(--percentage) * 1%);
			height: 0.5rem;
			background-color: hsl(calc(var(--percentage) * 1.2deg), 100%, 50%);
			border-radius: 100vw;
			transition: width 200ms ease-out;
		}

		.percentage {
			color: #aaa;
			font-family: monospace;
		}
	}

	.square {
		aspect-ratio: 1;
		display: grid;
		grid-template-rows: repeat(var(--size), 1fr);
		grid-template-columns: repeat(var(--size), 1fr);
	}

	.piece {
		background-color: hsl(var(--hue), 100%, 50%);
		border-radius: 15%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: min(4vw, 1.5rem);
		font-family: monospace;
		color: black;
		--margin: 0.2rem;
		margin: var(--margin);
		user-select: none;
	}

	.square.animating .piece {
		transition: transform 180ms ease-in-out;
		transform: translate(
			calc(var(--dx) * (100% + var(--margin) * 2)),
			calc(var(--dy) * (100% + var(--margin) * 2))
		);
	}

	menu {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-block: 1rem;
	}

	.setting {
		margin-block: 1rem;
	}

	select {
		padding: 0.25rem;
		background-color: black;
		color: white;
		outline: 1px solid #888;
		opacity: 1;
		border: none;
	}
</style>
