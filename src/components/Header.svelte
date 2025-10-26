<script lang="ts">
	type Props = {
		config: string
	}

	let { config }: Props = $props()
</script>

<header>
	<h1>Loopster</h1>
	<div class="config">{config}</div>
</header>

<style>
	header {
		margin-block: 1.25rem;
		text-align: center;
	}

	h1 {
		font-size: 1.75rem;
	}

	.config {
		color: var(--secondary-font-color);
		font-size: 1.25rem;
	}

	@media (min-width: 600px) {
		header {
			margin-block: 1rem;
		}

		h1 {
			font-size: 2.25rem;
		}
	}
</style>
