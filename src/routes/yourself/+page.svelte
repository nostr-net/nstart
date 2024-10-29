<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sk, pk, npub, name } from '$lib/store';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';
	import * as nip19 from 'nostr-tools/nip19';

	onMount(() => {
		// TODO: keep the session if the page is reloaded
		if ($sk.length === 0) {
			$sk = generateSecretKey();
			$pk = getPublicKey($sk);
			$npub = nip19.npubEncode($pk);
		}
	});
	function navigateContinue() {
		if (!$name) {
			alert('Please enter a name, bio and website are optional');
			return;
		}

		goto('/download');
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem]">PRESENT</div>
					<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[3.5rem]" id="tw">
						YOURSELF
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%]">
				<p class="">On Nostr you decide to be whoever you want.</p>
				<p class="mt-6">
					A Nostr profile usually include a name, a picture and some additional information. Every
					data is optional.
				</p>

				<p class="mt-6">
					The name is not a unique username, we can have as many Jacks we want! Feel free to use
					your real name or a nickname; you can change any info whenever you want.<br />
					But remember: online privacy matters, don’t share sensitive data.
				</p>

				<p class="mt-6">
					And yes, to join Nostr you don’t need to give your email, phone number or other data, it
					is KYC free.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		<div class="flex items-end justify-end">
			<div class="text-xl text-neutral-400">Your image</div>
			<div class="-mr-8 ml-2 mt-2 h-1 w-20 border-t-2 border-neutral-300"></div>
			<div class="h-24 w-24 rounded-full border-2 border-neutral-300 bg-neutral-100">
				<img src="/icons/pfp.svg" alt="pfp " />
			</div>
		</div>
		<div>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="text"
				placeholder="Your name"
				bind:value={$name}
				autofocus
				class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
			/>
			<textarea
				placeholder="A brief presentation"
				class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
			></textarea>
			<input
				type="text"
				placeholder="Your website"
				class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
			/>
		</div>
		<div class="mt-20 flex justify-end">
			<button
				on:click={navigateContinue}
				class="inline-flex items-center rounded bg-strongpink px-8 py-3 text-[1.3rem] text-white"
			>
				Continue <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
			</button>
		</div>
	</div>
</TwoColumnLayout>
