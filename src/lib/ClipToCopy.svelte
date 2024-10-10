<script>
	import { fade } from 'svelte/transition';

	export let textToCopy = '';
	export let confirmMessage = '';
	let showToast = false;

	function copyToClipboard() {
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				showToast = true;
				setTimeout(() => {
					showToast = false;
				}, 2000); // Toast will disappear after 2 seconds
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}
</script>

<div class="relative">
	{textToCopy}
	<button on:click={copyToClipboard} aria-label="Copy to clipboard" class="inline-block">
		<img src="/icons/copy.svg" alt="Copy to clipboard" class="-mb-[2px] ml-1 w-[18px]" />
	</button>
	{#if showToast}
		<div
			class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded bg-gray-800 px-2 py-1 text-sm font-semibold text-white transition-all duration-300 ease-in-out"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			class:opacity-0={!showToast}
			class:translate-y-2={!showToast}
		>
			{confirmMessage}
		</div>
	{/if}
</div>
