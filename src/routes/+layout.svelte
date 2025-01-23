<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { browser } from '$app/environment';

	// Check if we're in iframe mode
	let isModal = browser && window.self !== window.top;
	setContext('isModal', isModal);

	if (browser) {
		window.addEventListener('message', (event) => {
			if (event.data.type === 'CLEAR_SESSION_STORAGE') {
				sessionStorage.clear();
			}
		});
	}
</script>

{#if isModal}
	<slot />
{:else}
	<slot />
{/if}
