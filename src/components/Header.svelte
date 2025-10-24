<script lang="ts">
	type Props = {
		config: string
	}

	let { config }: Props = $props()
</script>

<header>
	<h1>Loopster &ndash; <span class="config">{config}</span></h1>
</header>

<style>
	header {
		margin-block: 1.25rem;
	}

	h1 {
		font-size: 1.75rem;
		text-align: center;
	}

	.config {
		letter-spacing: 4px;
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
