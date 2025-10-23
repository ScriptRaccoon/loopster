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
		margin-block: 2rem;
		text-align: center;
	}

	.config {
		letter-spacing: 4px;
	}
</style>
