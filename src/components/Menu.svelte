<script lang="ts">
	type Props = {
		reset_pieces: () => void
		scramble_pieces: () => void
		undo_move: () => void
	}

	let { reset_pieces, scramble_pieces, undo_move }: Props = $props()
</script>

<menu>
	<button class="btn" onclick={reset_pieces}>Reset</button>
	<button class="btn" onclick={() => scramble_pieces()}>Scramble</button>
	<button class="btn" onclick={() => undo_move()}>Undo</button>
</menu>

<style>
	menu {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-block: 1rem;
	}
</style>
