<script lang="ts">
	import dotenv from 'dotenv';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sk, npub, password } from '$lib/store';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';
	import * as nip49 from 'nostr-tools/nip49';

	// let browserSave = true;
	let requireEmailBackup = false;
	let emailSent = false;
	let emailSending = false;
	let email = '';
	let emailInput: HTMLInputElement;
	let backupPrivKey = '';
	let body = '';

	const smtpFromEmail = import.meta.env.VITE_SMTP_FROM_EMAIL;

	const subject = 'Your Nostr account';

	$: if (requireEmailBackup && emailInput) {
		setTimeout(() => {
			emailInput.focus();
		}, 10); // Use a timeout to ensure the DOM has updated
	}

	onMount(() => {
		if ($sk.length === 0) {
			goto('/');
		}
	});

	async function sendEmail() {
		emailSending = true;

		const response = await fetch('/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ to: email, subject, body })
		});

		const result = await response.json();

		if (response.ok) {
			console.log(result.message);
			emailSent = true;
			emailSending = false;
		} else {
			console.log(result.error);
		}
	}

	function send() {
		backupPrivKey = nip49.encrypt($sk, $password);

		body = `Hello!

This is your Nostr npub:
${$npub}

And this is your encrypted Nostr key:
${backupPrivKey}

Remember to save the chosen password in a safe place!

Welcome to Nostr :)`;

		if (requireEmailBackup) {
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
		sendEmail();
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
					{#if !$password}
						Just pick a strong password and keep it safe, write it downw now, make sure you don't
						forget it.
					{:else}
						We will use the password you picked up previously. Did you wrote it down, right? :)
					{/if}
				</p>
				<p class="mt-6">
					You will receive an email from {smtpFromEmail}, if you see nothing, check the spam folder.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		{#if !emailSent}
			<div class=" mt-6">
				<div class="custom-focus focus-within:ring-1">
					<CheckboxWithLabel bind:checked={requireEmailBackup} disabled={emailSending}>
						{#if !$password}
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
					disabled={!requireEmailBackup}
					class="mt-6 w-full rounded border-2 border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				/>

				<input
					type="password"
					placeholder="Pick a password"
					bind:value={$password}
					disabled={$password != '' || !requireEmailBackup}
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
			{#if requireEmailBackup && !emailSent}
				<button
					on:click={send}
					disabled={emailSending}
					class={`inline-flex items-center rounded px-8 py-3 text-[1.6rem] text-white sm:text-[1.3rem] ${!emailSending ? 'bg-strongpink text-white' : 'cursor-not-allowed bg-neutral-400 text-neutral-100'}`}
				>
					Send now <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-6 w-6" />
				</button>
			{/if}

			{#if emailSent || !requireEmailBackup}
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
