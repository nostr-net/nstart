<script>
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import { goto } from '$app/navigation';
	import { ncryptOption, password } from '$lib/store';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';

	let browserSave = true;
	let sendEmail = false;
	let email = '';

	function navigateContinue() {
		if (sendEmail) {
			if (!email || !$password) {
				alert('Please enter your email and pick a password');
				return;
			}
			const inputElement = document.getElementById('email');
			if (inputElement && !inputElement.validity.valid) {
				alert('Please double check your email');
				return;
			}
		}
		
		goto('/follow');
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem]">MORE USEFUL</div>
					<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[3.5rem]" id="tw">
						OPTIONS
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%]">
				<p class="mb-6">
					Now you have the possibility to save your nsec, split in part, in a pool of remote
					signers; this will allow to obtain a "bunker" url that you can use to login in many web,
					mobile and desktop apps (<a href="#" class="underline">learn more</a>).
				</p>
				<p class="mb-6">
					Finally we offer you the possibility to send your nsec, encrypted, to your email address
					to have another convenient backup location.<br />
					{#if !$ncryptOption}
						Just pick a strong password and keep it safe, write it downw now. make sure you don't
						forget it.
					{:else}
						We will use the password you picked up previously. Did you wrote it down, right? :)
					{/if}
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		<div class="custom-focus focus-within:ring-1">
			<CheckboxWithLabel bind:checked={browserSave}>
				I want to save my nsec, split in a pool of remote signers to be used for "bunker"
				connections
			</CheckboxWithLabel>
		</div>

		<div class="mt-6 w-24 border-2 border-neutral-200"></div>

		<div class=" mt-6">
			<div class="custom-focus focus-within:ring-1">
				<CheckboxWithLabel bind:checked={sendEmail}>
					{#if !$ncryptOption}
						I want to send my nsec, encrypted, to the following email address
					{:else}
						I want to send my nsec, encrypted (with the same password already entered), to the
						following email address
					{/if}
				</CheckboxWithLabel>
			</div>
			{#if sendEmail}
				<!-- svelte-ignore a11y-autofocus -->
				<input
					id="email"
					type="email"
					placeholder="Your email address"
					bind:value={email}
					autofocus
					class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				/>

				<input
					type="text"
					placeholder="Pick a password"
					bind:value={$password}
					disabled={$ncryptOption}
					class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				/>
			{/if}
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
