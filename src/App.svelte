<script lang="ts">
	import Board from './components/Board.svelte'
	import Header from './components/Header.svelte'
	import Menu from './components/Menu.svelte'
	import Progress from './components/Progress.svelte'
	import Settings from './components/Settings.svelte'
	import Toast, { send_toast } from './components/Toast.svelte'
	import type { Piece } from './types'
	import { rand_int } from './utils'

	let square_size = $state(7)
	let move_size = $state(3)

	let piece_grid = $state<Piece[][]>(get_initial_grid())
	let move_history: [number, number, boolean][] = []
	let square_element = $state<HTMLDivElement | null>(null)

	let animating = $state(false)
	let user_is_solving = false

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

	function handle_click(y: number, x: number, shiftkey: boolean) {
		if (animating) return
		if (Math.max(x, y) > square_size - move_size) return

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

		for (let u = x; u < x + move_size - 1; u++) {
			const piece = piece_grid[y][u]
			piece.dx = 1
			updates.push([y, u, piece])
		}

		for (let v = y; v < y + move_size - 1; v++) {
			const piece = piece_grid[v][x + move_size - 1]
			piece.dy = 1
			updates.push([v, x + move_size - 1, piece])
		}

		for (let u = x + move_size - 1; u > x; u--) {
			const piece = piece_grid[y + move_size - 1][u]
			piece.dx = -1
			updates.push([y + move_size - 1, u, piece])
		}

		for (let v = y + move_size - 1; v > y; v--) {
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

		for (let u = x + 1; u <= x + move_size - 1; u++) {
			const piece = piece_grid[y][u]
			piece.dx = -1
			updates.push([y, u, piece])
		}

		for (let v = y + 1; v <= y + move_size - 1; v++) {
			const piece = piece_grid[v][x + move_size - 1]
			piece.dy = -1
			updates.push([v, x + move_size - 1, piece])
		}

		for (let u = x + move_size - 2; u >= x; u--) {
			const piece = piece_grid[y + move_size - 1][u]
			piece.dx = 1
			updates.push([y + move_size - 1, u, piece])
		}

		for (let v = y + move_size - 2; v >= y; v--) {
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
				check_solved()
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

	function check_solved() {
		const is_solved = solved_coordinates.length === square_size ** 2
		if (is_solved && user_is_solving) {
			send_toast({
				title: 'Congratulations! You solved the puzzle! 🎉',
				variant: 'success',
			})
			user_is_solving = false
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
		user_is_solving = false
	}

	function scramble_pieces(move_count = 100 * square_size) {
		if (animating) return

		reset_pieces()

		for (let i = 0; i < move_count; i++) {
			const y = rand_int(0, square_size - move_size + 1)
			const x = rand_int(0, square_size - move_size + 1)
			const clockwise = Math.random() < 0.5

			if (clockwise) {
				move_pieces_clockwise(y, x, { record_move: false, animated: false })
			} else {
				move_pieces_anticlockwise(y, x, { record_move: false, animated: false })
			}
		}

		user_is_solving = true
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

	function change_square_size(new_size: number) {
		if (animating) return
		square_size = new_size
		move_size = Math.min(move_size, square_size)
		piece_grid = get_initial_grid()
		move_history = []
		user_is_solving = false
	}

	function change_move_size() {
		reset_pieces()
	}
</script>

<Header config="{move_size}/{square_size}" />

<div class="wrapper">
	<Progress percentage={percentage_solved_pieces} />

	<Board
		{square_size}
		{move_size}
		{animating}
		{piece_grid}
		bind:square_element
		{handle_click}
	/>

	<Menu {reset_pieces} {scramble_pieces} {undo_move} />

	<Settings
		bind:move_size
		bind:square_size
		{change_move_size}
		{change_square_size}
		{animating}
	/>
</div>

<Toast position="bottom-center" />

<style>
	.wrapper {
		width: min(90vw, 600px);
		margin-inline: auto;
	}
</style>
