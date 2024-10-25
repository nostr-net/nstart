<script>
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import { goto } from '$app/navigation';
	import { name, npub, ncryptOption, backupPrivKey, password } from '$lib/store';
	import ClipToCopy from '$lib/ClipToCopy.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';

	let backupInitialized = false;
	let backupDone = false;

	function createKey() {
		// TODO
		$npub = 'npub1test31geqamw7ukghlcaqzep734el58kv88dvwm5pjntc04cy5xq86test';
	}

	function togglePasswordField() {
		$ncryptOption = !$ncryptOption;
	}

	function downloadBackup() {
		if ($ncryptOption) {
			$backupPrivKey = 'ncryptsec1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx12345';
		} else {
			$backupPrivKey = 'nsec1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx12345';
		}

		if ($ncryptOption && !$password) {
			alert('Please enter a password before downloading the encrypted backup');
			return;
		}

		const blob = new Blob([$npub + '\n' + $backupPrivKey], { type: 'text/plain' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'nostr-private-key.txt';
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		backupInitialized = true;
	}

	function navigateContinue() {
		goto('/options');
	}

	function previewDownloadKey(str) {
		const firstPart = str.slice(0, 10);
		const lastPart = str.slice(-8);
		return `${firstPart} ... ${lastPart}`;
	}

	createKey();
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem]">YOUR KEYS</div>
					<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[3.5rem]" id="tw">
						ARE READY
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%]">
				<p class="">
					Well done <strong>{$name}</strong>, your Nostr profile is ready, yes it was so easy!
				</p>
				<p class="mt-6">
					On Nostr your public profile is identified by a unique string that start with “npub”, this
					is the public part you can share with anyone.
				</p>
				<p class="mt-6">
					Then there is the private key, that starts with “nsec”, with wich you can control you
					profile and act, for example posting notes. This must clearly be kept absolutely secret.
				</p>
				<p class="mt-6">
					Now please download your nsec as a txt file and save it in a safe place, for example your
					password manager.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		{#if !backupInitialized}
			<div class="text-xl">
				<div class=" text-neutral-400">Your npub is</div>
				<div class="break-words">
					<ClipToCopy textToCopy={$npub} confirmMessage="Copied!" />
				</div>
			</div>
		{/if}

		<div class="mt-10 flex flex-col justify-end">
			{#if !backupInitialized}
				{#if !$ncryptOption}
					<button
						on:click={downloadBackup}
						class="inline-flex w-full items-center justify-center rounded bg-strongpink px-8 py-3 text-[1.3rem] text-white"
					>
						Save my nsec <img
							src="/icons/arrow-right.svg"
							alt="continue"
							class="ml-4 mr-2 h-5 w-5 rotate-90"
						/>
					</button>

					<button
						on:click={togglePasswordField}
						class="mt-2 text-center text-sm text-neutral-400 hover:underline"
						>I want do download the encrypted version</button
					>
				{/if}

				{#if $ncryptOption}
					<!-- svelte-ignore a11y-autofocus -->
					<input
						type="text"
						bind:value={$password}
						placeholder="Pick a password"
						required
						class="w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
						autofocus
					/>
					<button
						class="mt-6 inline-flex w-full items-center justify-center rounded bg-strongpink px-8 py-3 text-[1.3rem] text-white"
						on:click={downloadBackup}
					>
						Save my ncryptsec <img
							src="/icons/arrow-right.svg"
							alt="continue"
							class="ml-4 mr-2 h-5 w-5 rotate-90"
						/>
					</button>

					<button
						on:click={togglePasswordField}
						class="mt-2 text-center text-sm text-neutral-400 hover:underline"
						>Never mind, I want do download the plain nsec</button
					>
				{/if}
				<div class="mt-8 text-neutral-600">
					From your nsec you can generate your npub, so it is the only information you really need
					to keep safe. But feel free to also copy your npub and keep it at hand.
				</div>
			{:else}
				<div class="flex justify-center">
					<img src="/icons/done.svg" alt="Done" class="w-24" />
				</div>
				<div class="mt-10 text-neutral-600">
					Now please open the file and check that the long string matches these starting and
					finishing characters:
					<div class="my-4 rounded bg-yellow-100 px-6 py-4">
						{previewDownloadKey($backupPrivKey)}
					</div>
					{#if $ncryptOption}
						Finally, copy the file in another safe place as additional backup and separately save
						the chosen password (<strong>{$password}</strong>).
					{:else}
						Finally, copy the file in another safe place as additional backup.
					{/if}
				</div>
				<div class="custom-focus mt-8 focus-within:ring-1">
					<CheckboxWithLabel bind:checked={backupDone}>
						{#if $ncryptOption}
							I saved the file and the password in a couple of safe places
						{:else}
							I saved the file in a couple of safe places
						{/if}
					</CheckboxWithLabel>
				</div>
				<button
					on:click={() => {
						backupInitialized = false;
						backupDone = false;
					}}
					class="mt-6 text-left text-sm text-neutral-400 hover:underline"
					>Do you need to download it again?</button
				>
			{/if}
		</div>

		<div class="mt-16 flex justify-end">
			<button
				on:click={navigateContinue}
				disabled={!backupDone}
				class={`inline-flex items-center rounded px-8 py-3 text-[1.3rem] ${backupDone ? 'bg-strongpink text-white' : 'cursor-not-allowed bg-neutral-400 text-neutral-100'}`}
			>
				Continue <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
			</button>
		</div>
	</div>
</TwoColumnLayout>
