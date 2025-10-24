<script lang="ts">
	type Props = {
		percentage: number
	}

	let { percentage }: Props = $props()
</script>

<div class="progress" style:--percentage={percentage}>
	<div class="bar" aria-hidden="true"></div>
	<div class="percentage" title="Percentage of solved pieces">
		{percentage}%
	</div>
</div>

<style>
	.progress {
		margin-block: 1rem 0.25rem;
		padding-inline: 0.2rem;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 1rem;
	}

	.bar {
		width: calc(var(--percentage) * 1%);
		height: 0.5rem;
		background-color: hsl(calc(var(--percentage) / 100 * 120deg), 100%, 50%);
		border-radius: 100vw;
		transition: width 200ms ease-out;
	}

	.percentage {
		color: var(--secondary-font-color);
		font-family: monospace;
	}
</style>
