<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { browser } from '$app/environment';

	// Check if we're in iframe mode
	let isModal = browser && window.self !== window.top;
	setContext('isModal', isModal);

	// Handle completion in iframe mode
	function handleComplete(result: any) {
		if (isModal && browser) {
			window.parent.postMessage(
				{
					type: 'WIZARD_COMPLETE',
					result
				},
				'*'
			);
		}
	}

	// Make it available globally
	if (browser) {
		(window as any).handleComplete = handleComplete;
	}
</script>

{#if isModal}
	<slot />
{:else}
	<slot />
{/if}
