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
		width: 100%;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 1rem;
	}

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
</style>
