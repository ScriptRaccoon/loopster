<script lang="ts">
	import { interval } from '../utils'

	type Props = {
		move_size: number
		board_size: number
		change_move_size: () => void
		change_board_size: (new_size: number) => void
		animating: boolean
	}

	let {
		move_size = $bindable(),
		board_size = $bindable(),
		change_move_size,
		change_board_size,
		animating,
	}: Props = $props()
</script>

<section>
	<h2>Settings</h2>

	<div class="settings">
		<div class="setting">
			<label for="board-size-select">Board Size</label>
			<select
				class="select"
				id="board-size-select"
				value={board_size}
				onchange={(e) => change_board_size(parseInt(e.currentTarget.value))}
				disabled={animating}
			>
				{#each interval(2, 10) as val}
					<option value={val}>{val}</option>
				{/each}
			</select>
		</div>

		<div class="setting">
			<label for="move-size-select">Loop Size</label>
			<select
				class="select"
				id="move-size-select"
				bind:value={move_size}
				onchange={change_move_size}
				disabled={animating}
			>
				{#each interval(2, board_size) as val}
					<option value={val}>{val}</option>
				{/each}
			</select>
		</div>
	</div>

	<p class="caution">Changing these settings will also reset the game.</p>
</section>

<style>
	section {
		margin-top: 2rem;
	}

	.settings {
		margin-block: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
	}

	.setting {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		@media (hover: hover) {
			&:has(:focus-visible) {
				label {
					color: var(--highlight-color);
				}
			}
		}
	}

	label {
		font-size: 0.825rem;
		text-transform: uppercase;
	}

	select {
		width: 5ch;
		text-align: right;
	}

	.caution {
		color: var(--secondary-font-color);
		font-size: 0.875rem;
	}
</style>
