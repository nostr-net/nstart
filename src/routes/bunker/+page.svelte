<script>
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import { goto } from '$app/navigation';
	import { npub } from '$lib/store';
	import ClipToCopy from '$lib/ClipToCopy.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';
	import LoadingBar from '$lib/LoadingBar.svelte';

	let activateBunker = false;
	let bunkerActivating = false;
	let bunkerActivated = false;
	let activationProgress = 0;
	let bunkerURL = '';

	function activate() {
		bunkerActivating = true;

		// TODO: activate bunker

		const interval = setInterval(() => {
			if (activationProgress < 100) {
				activationProgress += 10;
			} else {
				clearInterval(interval);
				bunkerActivating = false;
				bunkerActivated = true;
				bunkerURL = `bunker://${$npub}?relay=wss%3A%2F%2Fnos.lol&relay=wss%3A%2F%2Frelay.damus.io&relay=wss%3A%2F%2Frelay.nsecbunker.com&secret=xxxxxxx-yyyyyy-zzzzzzz`;
			}
		}, 200);
	}

	function navigateContinue() {
		goto('/follow');
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem]">MULTI SIGNER</div>
					<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[3.5rem]" id="tw">
						BUNKER
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%]">
				<p class="">
					Now you have the possibility to save your nsec, split in part, in a pool of remote
					signers; this will give you a "bunker" url that you can use to login in many web, mobile
					and desktop apps without exposing your key.
				</p>
				<p class="mt-6">
					Technically this is a custodial solution, but since your nsec is splitted and shared
					between a pool of 3 random signers using a tecquique called FROST, all the server shoulds
					cooperate to steal your key, and this is unlikely.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		{#if !bunkerActivated}
			<div class=" mt-6">
				<div class="custom-focus focus-within:ring-1">
					<CheckboxWithLabel bind:checked={activateBunker}>
						I want to save my nsec, split in a pool of remote signers to be used for "bunker"
						connections
					</CheckboxWithLabel>
				</div>
			</div>
			{#if activateBunker}
				<div class="mt-6">
					The key will be splitted and shared with these 3 indipendent signers:<br />
				</div>
				<div class="mt-6">
					signer.server-a.com<br />
					signer.server-k.com<br />
					signer.server-z.com<br />
				</div>
			{/if}
			{#if bunkerActivating || bunkerActivated}
				<div class="mt-6">
					<LoadingBar progress={activationProgress} />
				</div>
			{/if}
		{/if}

		{#if bunkerActivated}
			<div class="flex justify-center">
				<img src="/icons/done.svg" alt="Done" class="w-24" />
			</div>
			<div class="mt-10 text-neutral-600">
				All done! your bunker url is ready, copy it and put it in a safe place:
			</div>
			<div class="mt-6 text-xl">
				<div class="break-words">
					<ClipToCopy textToCopy={bunkerURL} confirmMessage="Copied!" />
				</div>
			</div>
		{/if}

		{#if activateBunker && !bunkerActivated}
			<div class="mt-20 flex justify-end">
				<button
					on:click={activate}
					disabled={bunkerActivating}
					class={`inline-flex items-center rounded px-8 py-3 text-[1.3rem] text-white ${!bunkerActivating ? 'bg-strongpink text-white' : 'cursor-not-allowed bg-neutral-400 text-neutral-100'}`}
				>
					Activate the bunker
					<img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
				</button>
			</div>
		{/if}

		{#if bunkerActivated || !activateBunker}
			<div class="mt-20 flex justify-end">
				<button
					on:click={navigateContinue}
					class="inline-flex items-center rounded bg-strongpink px-8 py-3 text-[1.3rem] text-white"
				>
					{bunkerActivated ? 'Continue' : 'No thanks, continue'}
					<img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
				</button>
			</div>
		{/if}
	</div>
</TwoColumnLayout>
