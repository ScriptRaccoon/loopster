<script lang="ts">
	import type { Piece } from '../types'

	type Props = {
		square_size: number
		move_size: number
		animating: boolean
		piece_grid: Piece[][]
		square_element: HTMLDivElement | null
		handle_click: (y: number, x: number, shiftkey: boolean) => void
	}

	let {
		square_size,
		move_size,
		animating,
		piece_grid,
		square_element = $bindable(),
		handle_click,
	}: Props = $props()
</script>

<div class="board" style:--size={square_size} bind:this={square_element} class:animating>
	{#each { length: square_size } as _, y}
		{#each { length: square_size } as _, x}
			{@const piece = piece_grid[y][x]}
			<button
				class="piece"
				onclick={(e) => handle_click(y, x, e.shiftKey)}
				style:--hue={piece.hue}
				style:--dx={piece.dx}
				style:--dy={piece.dy}
				disabled={Math.max(x, y) > square_size - move_size}
			>
				{piece.label}
			</button>
		{/each}
	{/each}
</div>

<style>
	.board {
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

	.board.animating .piece {
		transition: transform 180ms ease-in-out;
		transform: translate(
			calc(var(--dx) * (100% + var(--margin) * 2)),
			calc(var(--dy) * (100% + var(--margin) * 2))
		);
	}
</style>
