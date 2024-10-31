<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sk } from '$lib/store';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import { ncryptOption, password } from '$lib/store';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';

	// let browserSave = true;
	let sendEmail = false;
	let emailSent = false;
	let email = '';
	let emailInput: HTMLInputElement;

	$: if (sendEmail && emailInput) {
		setTimeout(() => {
			emailInput.focus();
		}, 10); // Use a timeout to ensure the DOM has updated
	}

	onMount(() => {
		if ($sk.length === 0) {
			goto('/');
		}
	});

	function send() {
		if (sendEmail) {
			if (!email || !$password) {
				alert('Please enter your email and pick a password');
				return;
			}
			const inputElement = document.getElementById('email');
			if (inputElement && !(inputElement as HTMLObjectElement).validity!.valid) {
				alert('Please double check your email');
				return;
			}
		}

		// TODO: send email

		emailSent = true;
	}

	function navigateContinue() {
		goto('/bunker');
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem]">EMAIL</div>
					<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[3.5rem]" id="tw">
						BACKUP
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%]">
				<p class="mt-6">
					We offer you the possibility to send your encrypted nsec (so actually your ncryptsec) to
					your email address to have another convenient backup location.<br />
				</p>
				<p class="mt-6">
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
		{#if !emailSent}
			<div class=" mt-6">
				<div class="custom-focus focus-within:ring-1">
					<CheckboxWithLabel bind:checked={sendEmail}>
						{#if !$ncryptOption}
							I want to send my encrypted nsec, to the following email address
						{:else}
							I want to send my encrypted nsec (with the same password already entered), to the
							following email address
						{/if}
					</CheckboxWithLabel>
				</div>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					bind:this={emailInput}
					id="email"
					type="email"
					placeholder="Your email address"
					bind:value={email}
					autofocus
					disabled={!sendEmail}
					class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				/>

				<input
					type="password"
					placeholder="Pick a password"
					bind:value={$password}
					disabled={$ncryptOption || !sendEmail}
					class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				/>
			</div>
		{:else}
			<div class="flex justify-center">
				<img src="/icons/done.svg" alt="Done" class="w-24" />
			</div>
			<div class="mt-10 text-neutral-600">
				The email has been sent and should arrive in your <em>{email}</em> inbox in a few moments.
			</div>
			<button
				on:click={() => {
					emailSent = false;
				}}
				class="mt-6 text-left text-sm text-neutral-400 hover:underline"
				>Do you need to sent it again?</button
			>
		{/if}

		<div class="mt-16 flex justify-center sm:justify-end">
			{#if sendEmail && !emailSent}
				<button
					on:click={send}
					class="inline-flex items-center rounded bg-strongpink px-8 py-3 text-[1.6rem] text-white sm:text-[1.3rem]"
				>
					Send now <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-6 w-6" />
				</button>
			{/if}

			{#if emailSent || !sendEmail}
				<button
					on:click={navigateContinue}
					class="inline-flex items-center rounded bg-strongpink px-8 py-3 text-[1.6rem] text-white sm:text-[1.3rem]"
				>
					{emailSent ? 'Continue' : 'No thanks, continue'}
					<img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-6 w-6" />
				</button>
			{/if}
		</div>
	</div>
</TwoColumnLayout>
