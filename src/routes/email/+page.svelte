<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		accent,
		sk,
		pk,
		npub,
		password,
		email,
		name,
		ncryptsec,
		skipBunker,
		skipFollow,
		callingAppCode
	} from '$lib/store';
	import { isMobile } from '$lib/mobile';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';
	import LoadingBar from '$lib/LoadingBar.svelte';
	import { sendEmail } from '$lib/actions';
	import { isWasmSupported } from '$lib/wasm';
	import ContinueButton from '$lib/ContinueButton.svelte';

	let wantEmailBackup = false;
	let emailInput: HTMLInputElement;
	let needsPassword = true;
	let activationProgress = 0;

	onMount(() => {
		document.documentElement.style.setProperty('--accent-color', '#' + $accent);
		needsPassword = !$password || $password == '';
	});

	const smtpFromEmail = import.meta.env.VITE_SMTP_FROM_EMAIL;

	$: if (wantEmailBackup && emailInput) {
		setTimeout(() => {
			emailInput.focus();
		}, 10); // Use a timeout to ensure the DOM has updated
	}

	onMount(() => {
		if ($name.length === 0) {
			goto('/');
		}
	});

	async function send(ev: MouseEvent) {
		ev.preventDefault();

		if (!$email || !$password) {
			alert('Please enter your email and pick a password');
			return;
		}

		const inputElement = document.getElementById('email');
		if (inputElement && !(inputElement as HTMLObjectElement).validity!.valid) {
			alert('Please double check your email');
			return;
		}

		let intv = setInterval(() => {
			if (activationProgress < 95) activationProgress = activationProgress + 5;
		}, 500);

		await sendEmail($sk, $pk, $npub, $ncryptsec, $email);
		clearInterval(intv);
		activationProgress = 100;

		setTimeout(() => {
			goto('/bunker');
		}, 1000);
	}

	function navigateContinue() {
		if ($skipBunker) {
			if ($skipFollow) {
				if ($callingAppCode) {
					goto('/back');
				} else {
					goto('/finish');
				}
			} else {
				goto('/follow');
			}
		} else {
			goto('/bunker');
		}
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-accent pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 dark:text-neutral-400 sm:text-[3rem]">EMAIL</div>
					<div class="break-words text-[3.5rem] leading-[1em] text-black dark:text-white sm:h-auto sm:text-[3.5rem]" id="tw">
						BACKUP
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 dark:text-neutral-300 sm:w-[90%]">
				<p class="mt-6">
					We offer you the possibility to send your encrypted <em class="italic">nsec</em> (so
					actually a <em class="italic">ncryptsec</em>) to your email address to have another
					convenient backup location.<br />
				</p>
				<p class="mt-6">
					{#if needsPassword}
						Just pick a strong password and keep it safe, write it down now, make sure you don't
						lose it.
					{:else}
						We will use the same password you picked up previously. You wrote it down, right? :)
					{/if}
				</p>
				<p class="mt-6">
					You will receive an email from {smtpFromEmail}. If you see nothing, check your spam
					folder.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		<div class=" mt-6 text-neutral-700 dark:text-neutral-300">
			<div>
				<CheckboxWithLabel
					bind:checked={wantEmailBackup}
					disabled={activationProgress > 0 || !isWasmSupported()}
				>
					I want to send my encrypted nsec {#if !needsPassword}(with the same password already
						entered previously){/if} to the following email address:
				</CheckboxWithLabel>
			</div>
			{#if !isWasmSupported()}
				<div class="mt-6 bg-amber-100 p-2">
					Sorry your browser doesn't support WASM, so you cannot use this feature
				</div>
			{/if}
			<!-- svelte-ignore a11y-autofocus -->
			<input
				bind:this={emailInput}
				id="email"
				type="email"
				placeholder="Your email address"
				bind:value={$email}
				autofocus={!$isMobile}
				disabled={!wantEmailBackup || activationProgress > 0}
				autocapitalize="off"
				class="input-hover-enabled mt-6 w-full rounded border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-xl text-black dark:text-white focus:border-neutral-700 dark:focus:border-neutral-400 focus:outline-none"
			/>

			{#if needsPassword}
				<input
					type="text"
					placeholder="Pick a password"
					bind:value={$password}
					disabled={!wantEmailBackup || activationProgress > 0}
					autocapitalize="off"
					class="input-hover-enabled mt-6 w-full rounded border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-xl text-black dark:text-white focus:border-neutral-700 dark:focus:border-neutral-400 focus:outline-none"
				/>
			{/if}

			{#if activationProgress > 0}
				<div class="mt-6">
					<LoadingBar progress={activationProgress} />
				</div>
			{/if}
		</div>

		<div class="mt-16 flex justify-center sm:justify-end">
			{#if wantEmailBackup}
				<ContinueButton
					onClick={send}
					disabled={$ncryptsec === '' || activationProgress > 0}
					text={activationProgress > 0 ? 'Sending...' : 'Send now'}
				/>
			{:else}
				<ContinueButton onClick={navigateContinue} disabled={false} text="No, thanks, continue" />
			{/if}
		</div>
	</div>
</TwoColumnLayout>
