<script lang="ts">
	import type { Piece } from '../types'

	type Props = {
		board_size: number
		move_size: number
		animating: boolean
		piece_grid: Piece[][]
		animation_speed: number
		handle_click: (y: number, x: number, shiftkey: boolean) => void
	}

	let {
		board_size,
		move_size,
		animating,
		piece_grid,
		animation_speed,
		handle_click,
	}: Props = $props()
</script>

<div
	class="board"
	style:--size={board_size}
	style:--transition-duration="{animation_speed}ms"
	class:animating
>
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
		--gap: 0.25rem;
		gap: var(--gap);
	}

	.piece {
		background: hsl(var(--hue), 100%, 52%);
		border-radius: 20%;
		aspect-ratio: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: calc(0.4 * min(94vw, 600px) / var(--size));
		color: var(--piece-text-color);
		font-family: monospace;
		font-weight: bold;
		user-select: none;
	}

	.board.animating .piece {
		transition: transform var(--transition-duration, 0ms) ease-in-out;
		transform: translate(
			calc(var(--dx) * (100% + var(--gap))),
			calc(var(--dy) * (100% + var(--gap)))
		);
	}
</style>
