<script lang="ts">
	import { onMount } from 'svelte';
	import { finalizeEvent, type EventTemplate } from '@nostr/tools/pure';

	import { goto } from '$app/navigation';
	import { accent, sk, pk, name, picture, about, website } from '#lib/store';
	import { isMobile } from '#lib/mobile';
	import TwoColumnLayout from '#lib/TwoColumnLayout.svelte';
	import LoadingBar from '#lib/LoadingBar.svelte';
	import ContinueButton from '#lib/ContinueButton.svelte';
	import { mineEmail, publishRelayList, publishProfile } from '#lib/actions';
	import { isWasmSupported } from '#lib/wasm';

	let picturePreview: string | null = null;
	let activationProgress = 0;

	onMount(() => {
		document.documentElement.style.setProperty('--accent-color', '#' + $accent);
		if ($sk.length === 0 && isWasmSupported()) {
			mineEmail($sk, $pk);
		}
	});

	function triggerFileInput() {
		document.getElementById('image')?.click();
	}

	function previewImage(event: Event & { currentTarget: HTMLInputElement }) {
		const file = event.currentTarget.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				picturePreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async function calculateFileHash(file: File): Promise<string> {
		// sha256 of the file contents, hex-encoded (as required by the blossom
		// upload auth event); @nostr/tools removed its nip96 helper, so use WebCrypto
		const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
		return Array.from(new Uint8Array(digest))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	async function blossomAuth(file: File) {
		// Calculate the hash of the image
		let imageHash = await calculateFileHash(file);

		// Create the event and sign it
		let eventTemplate: EventTemplate = {
			kind: 24242,
			created_at: Math.floor(Date.now() / 1000),
			tags: [
				['t', 'upload'],
				['x', imageHash],
				['expiration', String(Math.floor(Date.now() / 1000) + 86400)]
			],
			content: 'Upload profile pic'
		};
		let signedEvent = finalizeEvent(eventTemplate, $sk);

		// Return a base64 of the json event
		const bytes = new TextEncoder().encode(JSON.stringify(signedEvent));
		let binary = '';
		for (const byte of bytes) {
			binary += String.fromCharCode(byte);
		}
		return btoa(binary);
	}

	async function uploadImage(file: File) {
		let auth = await blossomAuth(file);
		const arrayBuffer = await file.arrayBuffer();

		const response = await fetch('https://cdn.nostrcheck.me/upload', {
			method: 'PUT',
			headers: {
				Authorization: `Nostr ${auth}`
			},
			body: arrayBuffer
		});

		if (response.ok) {
			const data = await response.json();
			activationProgress = 100;
			return data;
		} else {
			console.error('Upload failed:', response.statusText);
			alert('Image upload failed. Please try again.');
		}
	}

	async function navigateContinue() {
		if (!$name) {
			alert('Please enter a name, bio and website are optional');
			return;
		}

		const file = (document.getElementById('image') as HTMLInputElement).files?.[0];

		if (file) {
			let intv = setInterval(() => {
				if (activationProgress < 95) activationProgress = activationProgress + 10;
			}, 500);

			try {
				let data = await uploadImage(file); // Wait for the upload to complete
				$picture = data.url;
			} catch (error) {
				console.error('Error during upload:', error);
			}
			clearInterval(intv);
		}

		publishProfile($sk, {
			name: $name,
			about: $about,
			picture: $picture,
			website:
				$website.trim() === '' ? '' : $website.startsWith('http') ? $website : `https://${$website}`
		});
		publishRelayList($sk, $pk);

		goto('/download');
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="border-accent mb-8 border-l-[0.9rem] pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div
						class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem] dark:text-neutral-400"
					>
						PRESENT
					</div>
					<div
						class="text-[3.5rem] leading-[1em] break-words text-black sm:h-auto sm:text-[3.5rem] dark:text-white"
						id="tw"
					>
						YOURSELF
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%] dark:text-neutral-300">
				<p class="">On Nostr you decide to be whoever you want.</p>
				<p class="mt-6">
					A Nostr profile usually includes a name, a picture and some additional information, but
					it's all optional.
				</p>

				<p class="mt-6">
					The name is not a unique username, we can have as many Jacks we want! Feel free to use
					your real name or a nickname; you can always change it later.<br />
					But remember: online privacy matters, don't share sensitive data.
				</p>

				<p class="mt-6">
					And yes, to join Nostr you don't need to give your email address, phone number or anything
					like that, it is KYC free.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		<div class="mb-6 flex items-end justify-end">
			<button on:click={triggerFileInput} class="text-xl text-neutral-400 dark:text-neutral-500"
				>Your image</button
			>
			<div
				class="mt-2 -mr-8 ml-2 h-1 w-20 border-t-2 border-neutral-300 dark:border-neutral-600"
			></div>
			<button
				on:click={triggerFileInput}
				class="input-hover-enabled h-24 w-24 rounded-full border-2 border-neutral-300 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800"
			>
				<!-- svelte-ignore a11y-img-redundant-alt -->
				{#if picturePreview || $picture}
					<img
						src={picturePreview || $picture}
						alt="Profile Picture"
						class="h-full w-full rounded-full object-cover"
					/>
				{:else}
					<img
						src="/icons/pfp.svg"
						alt="Default Profile Picture"
						class="h-full w-full rounded-full object-cover"
					/>
				{/if}
			</button>
		</div>
		<div>
			<!-- File input for image upload -->
			<input type="file" id="image" accept="image/*" on:change={previewImage} class="hidden" />
			<div class="mb-1 flex items-end justify-between">
				{#if $name != ''}<label
						for="name"
						class="ml-4 text-xs text-neutral-700 uppercase dark:text-neutral-300"
						>Your (nick)name</label
					>{:else}<div></div>{/if}
				<div class="mr-4 text-right text-xs text-neutral-500 uppercase dark:text-neutral-400">
					required
				</div>
			</div>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				id="name"
				type="text"
				placeholder="Your (nick)name"
				bind:value={$name}
				autofocus={!isMobile}
				class="input-hover-enabled mb-4 w-full rounded border-2 border-neutral-300 bg-white px-4 py-2 text-xl text-black focus:border-neutral-700 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:focus:border-neutral-400"
			/>
			<div class="mb-1 flex items-end justify-between">
				{#if $about != ''}<label
						for="about"
						class="ml-4 text-xs text-neutral-700 uppercase dark:text-neutral-300"
						>Something about you</label
					>{:else}<div></div>{/if}
				<div class="mr-4 text-right text-xs text-neutral-400 uppercase dark:text-neutral-600">
					optional
				</div>
			</div>
			<textarea
				id="about"
				placeholder="Something about you"
				bind:value={$about}
				class="input-hover-enabled mb-4 w-full rounded border-2 border-neutral-300 bg-white px-4 py-2 text-xl text-black focus:border-neutral-700 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:focus:border-neutral-400"
			></textarea>
			<div class="mb-1 flex items-end justify-between">
				{#if $website != ''}<label
						for="about"
						class="ml-4 text-xs text-neutral-700 uppercase dark:text-neutral-300"
						>Your website</label
					>{:else}<div></div>{/if}
				<div class="mr-4 text-right text-xs text-neutral-400 uppercase dark:text-neutral-600">
					optional
				</div>
			</div>
			<input
				type="text"
				placeholder="Your website"
				bind:value={$website}
				class="input-hover-enabled w-full rounded border-2 border-neutral-300 bg-white px-4 py-2 text-xl text-black focus:border-neutral-700 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:focus:border-neutral-400"
			/>
			{#if activationProgress > 0}
				<div class="mt-6">
					<LoadingBar progress={activationProgress} />
				</div>
			{/if}
		</div>
		<div class="mt-16 flex justify-center sm:justify-end">
			<ContinueButton
				onClick={navigateContinue}
				disabled={activationProgress > 0 || !$name}
				text={activationProgress > 0 ? 'Uploading...' : 'Continue'}
			/>
		</div>
	</div>
</TwoColumnLayout>
