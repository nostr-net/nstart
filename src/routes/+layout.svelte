<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { browser } from '$app/environment';

	// Check if we're in iframe mode
	let isModal = browser && window.self !== window.top;
	setContext('isModal', isModal);
</script>

{#if isModal}
	<slot />
{:else}
	<slot />
{/if}
