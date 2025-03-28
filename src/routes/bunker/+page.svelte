<script lang="ts">
	import { onMount } from 'svelte';
	import { shardGetBunker } from '@fiatjaf/promenade-trusted-dealer';
	import { pool } from '@nostr/gadgets/global';

	import { goto } from '$app/navigation';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import {
		accent,
		sk,
		name,
		pk,
		inboxes,
		bunkerURI,
		forceBunker,
		skipFollow,
		callingAppCode
	} from '$lib/store';
	import ClipToCopy from '$lib/ClipToCopy.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';
	import LoadingBar from '$lib/LoadingBar.svelte';
	import { signers, minePow, selectReadRelays } from '$lib/nostr';
	import { isWasmSupported } from '$lib/wasm';
	import ContinueButton from '$lib/ContinueButton.svelte';
	import DoneIcon from '$lib/DoneIcon.svelte';

	let activateBunker = isWasmSupported();
	let bunkerActivating = false;
	let activationProgress = 0;
	let advanceSignersSelection = false;
	let selectedSigners = new Set(signers.map((s) => s.pubkey));
	const defaultThreshold = 2;
	const defaultSelected = 3;
	const minThreshold = 2;
	let threshold = defaultThreshold;

	function toggleAdvancedMode() {
		advanceSignersSelection = !advanceSignersSelection;
		if (!advanceSignersSelection) {
			threshold = defaultThreshold;
			selectedSigners = new Set(signers.map((s) => s.pubkey));
		}
	}

	function toggleSigner(pubkey: string) {
		if (selectedSigners.has(pubkey)) {
			if (selectedSigners.size > threshold) {
				selectedSigners.delete(pubkey);
				selectedSigners = selectedSigners;
				// If we remove a signer and threshold is now greater than selected signers, adjust it
				if (threshold > selectedSigners.size) {
					threshold = selectedSigners.size;
				}
			}
		} else {
			selectedSigners.add(pubkey);
			selectedSigners = selectedSigners;
		}
	}

	// Function to increment threshold
	function incrementThreshold() {
		if (threshold >= selectedSigners.size) {
			threshold = minThreshold;
		} else {
			threshold++;
		}
	}

	onMount(() => {
		document.documentElement.style.setProperty('--accent-color', '#' + $accent);

		if ($name.length === 0) {
			goto('/');
			return;
		}
	});

	async function activate(event: Event) {
		event.preventDefault();
		bunkerActivating = true;

		let intv = setInterval(() => {
			if (activationProgress < 98) activationProgress++;
		}, 3000);

		try {
			// convert selected signers back to array of pubkeys
			const selectedSignerPubkeys = Array.from(selectedSigners);

			$bunkerURI = await shardGetBunker(
				pool,
				$sk,
				$pk,
				threshold,
				advanceSignersSelection ? selectedSignerPubkeys.length : defaultSelected,
				selectedSignerPubkeys,
				'wss://promenade.fiatjaf.com',
				20,
				$inboxes,
				$inboxes[$pk] || selectReadRelays(),
				minePow,
				(p: number) => {
					activationProgress = p;
				}
			);
			bunkerActivating = false;
		} catch (err) {
			console.error(err);
			bunkerActivating = false;
		}

		clearInterval(intv);
	}

	function downloadBunker() {
		const blob = new Blob(['Your bunker (Nostr connect) URL:\n\n' + $bunkerURI], {
			type: 'text/plain'
		});
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'nostr-bunker-url.txt';
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function navigateContinue() {
		if ($skipFollow) {
			if ($callingAppCode) {
				goto('/back');
			} else {
				goto('/finish');
			}
		} else {
			goto('/follow');
		}
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-accent pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div
						class="text-[3rem] leading-[1em] text-neutral-500 dark:text-neutral-400 sm:text-[3rem]"
					>
						MULTI SIGNER
					</div>
					<div
						class="break-words text-[3.5rem] leading-[1em] text-black dark:text-white sm:h-auto sm:text-[3.5rem]"
						id="tw"
					>
						BUNKER
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 dark:text-neutral-300 sm:w-[90%]">
				<p class="">
					Now you have the possibility to split your <em class="italic">nsec</em> using a technique
					called
					<a href="https://www.youtube.com/watch?v=ReN0kMzDFro" target="_blank">FROST</a> and distribute
					each shard to an independent trusted remote signer.
				</p>
				<p class="mt-6">
					This will give you a <em class="italic">bunker</em> code that you can use to login in many
					web, mobile and desktop apps without exposing your
					<em class="italic">nsec</em>.
				</p>
				<p class="mt-6">
					If you ever lose your <em class="italic">bunker</em> code, if the signers vanish from
					Earth and it stops working or if it gets stolen by a malware virus you can use your
					<em class="italic">nsec</em> to create a new and invalidate the old one.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive" class="text-neutral-700 dark:text-neutral-300">
		{#if $bunkerURI === ''}
			<div class=" mt-6">
				{#if !$forceBunker}
					<div>
						<CheckboxWithLabel
							bind:checked={activateBunker}
							disabled={bunkerActivating || !isWasmSupported()}
						>
							I want to save my nsec, split in a pool of remote signers to be used for "bunker"
							connections
						</CheckboxWithLabel>
					</div>
				{/if}
			</div>
			{#if !isWasmSupported()}
				<div class="mt-6 bg-amber-100 p-2 dark:bg-amber-900">
					Sorry your browser doesn't support WASM, so you cannot use this feature
				</div>
			{/if}
			{#if activateBunker}
				{#if !advanceSignersSelection}
					<div class="mt-6">
						The key will be split and shared with {advanceSignersSelection
							? selectedSigners.size
							: defaultSelected} independent signers, {threshold}
						signers are required to sign an event.<br />
					</div>
					<div class="mt-4">The procedure could require some time, please hold on.</div>
				{/if}
				{#if advanceSignersSelection}
					<hr class="mt-6 border-2" />
					<div class="mt-2">Select the desidered signers:</div>
					<div class="mt-4">
						<div class="space-y-2">
							{#each signers as signer}
								<CheckboxWithLabel
									checked={selectedSigners.has(signer.pubkey)}
									onClick={() => toggleSigner(signer.pubkey)}
									disabled={selectedSigners.size <= threshold && selectedSigners.has(signer.pubkey)}
									>{signer.name}</CheckboxWithLabel
								>
							{/each}
						</div>
						<div class="mt-4">
							{#if selectedSigners.size < minThreshold}
								Select at least {3 - selectedSigners.size} more signer{selectedSigners.size === 2
									? ''
									: 's'}
							{:else}
								We'll use a <button
									class="cursor-pointer text-accent underline hover:no-underline"
									on:click={incrementThreshold}>{threshold}</button
								>-of-{selectedSigners.size} multi-signature schema using the selected signers
							{/if}
						</div>
						{#if threshold == selectedSigners.size}
							<div class="mt-2">
								<strong>Warning</strong>, this scheme is risky, if one of the signers is offline,
								the events will not be able to be signed.
							</div>
						{/if}
					</div>
				{/if}

				<button
					class="text-strongpink mt-4 text-left text-sm underline"
					on:click={() => toggleAdvancedMode()}
				>
					{advanceSignersSelection
						? 'I want to use the automatic signers selection'
						: 'Advanced signers selection'}
				</button>
			{/if}
			{#if bunkerActivating || $bunkerURI !== ''}
				<div class="mt-6">
					<LoadingBar progress={activationProgress} />
				</div>
			{/if}
		{/if}

		{#if $bunkerURI !== ''}
			<div class="flex h-24 justify-center text-neutral-700 dark:text-neutral-300">
				<DoneIcon />
			</div>
			<div class="mt-10 text-neutral-600 dark:text-neutral-300">
				All done! your bunker code is ready. Save it for later so that you can log into Nostr
				clients without having to use your secret key:
			</div>
			<div class="mt-6 text-xl">
				<div class="break-words">
					<ClipToCopy textToCopy={$bunkerURI} confirmMessage="Copied!" />
				</div>
			</div>
			<button
				on:click={downloadBunker}
				class="mt-4 inline-flex w-full items-center justify-center rounded bg-accent px-8 py-3 text-[1.3rem] text-white"
			>
				Save my bunker <img
					src="/icons/arrow-right.svg"
					alt="continue"
					class="ml-4 mr-2 h-5 w-5 rotate-90"
				/>
			</button>
		{/if}

		{#if activateBunker && $bunkerURI === ''}
			<div class="mt-16 flex justify-center sm:justify-end">
				<ContinueButton
					onClick={activate}
					disabled={bunkerActivating}
					text={bunkerActivating ? 'Activating...' : 'Activate the bunker'}
				/>
			</div>
		{/if}

		{#if $bunkerURI !== '' || !activateBunker}
			<div class="mt-16 flex justify-center sm:justify-end">
				<ContinueButton
					onClick={navigateContinue}
					disabled={false}
					text={$bunkerURI !== '' ? 'Continue' : 'No, thanks, continue'}
				/>
			</div>
		{/if}
	</div>
</TwoColumnLayout>
