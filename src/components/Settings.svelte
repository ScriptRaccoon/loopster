<script lang="ts">
	import { interval } from '../utils'

	type Props = {
		move_size: number
		square_size: number
		change_move_size: () => void
		change_square_size: (new_size: number) => void
		animating: boolean
	}

	let {
		move_size = $bindable(),
		square_size = $bindable(),
		change_move_size,
		change_square_size,
		animating,
	}: Props = $props()
</script>

<section>
	<h2>Settings</h2>

	<p>Caution: Updating these settings will reset the game.</p>

	<div class="setting">
		<label for="move-size-select">Move Size</label>
		<select
			id="move-size-select"
			bind:value={move_size}
			onchange={change_move_size}
			disabled={animating}
		>
			{#each interval(2, square_size) as val}
				<option value={val}>{val}</option>
			{/each}
		</select>
	</div>

	<div class="setting">
		<label for="square-size-select">Board Size</label>
		<select
			id="square-size-select"
			value={square_size}
			onchange={(e) => change_square_size(parseInt(e.currentTarget.value))}
			disabled={animating}
		>
			{#each interval(2, 10) as val}
				<option value={val}>{val}</option>
			{/each}
		</select>
	</div>
</section>

<style>
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
