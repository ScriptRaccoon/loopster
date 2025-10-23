<script lang="ts">
	import type { Piece } from '../types'

	type Props = {
		board_size: number
		move_size: number
		animating: boolean
		piece_grid: Piece[][]
		board_element: HTMLDivElement | null
		handle_click: (y: number, x: number, shiftkey: boolean) => void
	}

	let {
		board_size,
		move_size,
		animating,
		piece_grid,
		board_element = $bindable(),
		handle_click,
	}: Props = $props()
</script>

<div class="board" style:--size={board_size} bind:this={board_element} class:animating>
	{#each { length: board_size } as _, y}
		{#each { length: board_size } as _, x}
			{@const piece = piece_grid[y][x]}
			<button
				class="piece"
				onclick={(e) => handle_click(y, x, e.shiftKey)}
				style:--hue={piece.hue}
				style:--dx={piece.dx}
				style:--dy={piece.dy}
				disabled={Math.max(x, y) > board_size - move_size}
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
