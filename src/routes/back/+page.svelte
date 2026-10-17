<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { get } from 'svelte/store';
	import * as nip19 from '@nostr/tools/nip19';
	import { goto } from '$app/navigation';
	import {
		accent,
		sk,
		bunkerURI,
		ncryptsec,
		callingAppName,
		callingAppType,
		callingAppCode,
		avoidNsec,
		avoidNcryptsec
	} from '#lib/store';
	import { validateCallingAppParams, callingAppHost } from '#lib/callingApp';
	import BasicLayout from '#lib/BasicLayout.svelte';
	import { name, npub } from '#lib/store';

	let loginToken: string;
	let actionURL: string;
	let actionHost: string | undefined;

	onMount(() => {
		document.documentElement.style.setProperty('--accent-color', '#' + get(accent));

		if (get(name).length === 0) {
			goto('/');
		}

		// only build a redirect URL from params that pass validation
		const callingApp = validateCallingAppParams(
			get(callingAppName),
			get(callingAppType),
			get(callingAppCode)
		);
		if (!callingApp) {
			callingAppName.set('');
			callingAppType.set('');
			callingAppCode.set('');
			goto('/');
			return;
		}

		if (get(bunkerURI).length > 0) {
			loginToken = get(bunkerURI);
		} else if (get(ncryptsec).length > 0 && !get(avoidNcryptsec)) {
			loginToken = get(ncryptsec);
		} else if (get(avoidNsec)) {
			loginToken = 'null';
		} else {
			loginToken = nip19.nsecEncode(get(sk));
		}

		switch (callingApp.type) {
			case 'modal':
				if (browser && window.self !== window.top) {
					window.parent.postMessage(
						{
							type: 'WIZARD_COMPLETE',
							result: {
								nostrLogin: loginToken
							}
						},
						'*'
					);
					// the generated key must not linger in the iframe's storage
					sessionStorage.clear();
				}
				break;
			case 'web':
			case 'popup':
				actionURL = `${callingApp.code}#nostr-login=${loginToken}`;
				actionHost = callingAppHost(callingApp.type, callingApp.code) ?? undefined;
				break;
			case 'android':
				actionURL = `intent:${loginToken}#Intent;scheme=nostr-login;package=${callingApp.code};end;`;
				break;
			case 'ios':
				actionURL = `${callingApp.code}://${loginToken}`;
				break;
		}
	});

	function redirectAndClose() {
		window.opener.location.href = actionURL;
		window.close();
	}

	function redirectBack() {
		window.location.href = actionURL;
		sessionStorage.clear();
	}
</script>

<BasicLayout>
	<div slot="content" class="animate-fade1">
		<!-- Welcome title -->
		<div class="border-accent relative mb-8 border-l-[0.9rem] pl-4 sm:-ml-8">
			<h1 class="font-bold">
				<div
					class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[6rem] dark:text-neutral-400"
				>
					YOU ARE
				</div>
				<div
					class="text-[3.5rem] leading-[1em] break-words text-black sm:h-auto sm:text-[7rem] dark:text-white"
					id="tw"
				>
					READY TO GO!
				</div>
			</h1>
		</div>

		<!-- Intro text -->
		<div class="text-neutral-700 sm:w-[90%] dark:text-neutral-200">
			<p class="text-xl sm:w-[80%]">
				We're done, <strong>{$name}</strong>! Now you can start exploring Nostr — just click below
				to go back to <strong>{$callingAppName}</strong>:
			</p>
			<div class="mt-8">
				<button
					on:click={$callingAppType === 'popup' ? redirectAndClose : redirectBack}
					type="submit"
					class="bg-accent inline-flex items-center rounded px-6 py-4 text-[1.8rem] text-white sm:px-10"
				>
					Go back to {$callingAppName}
					<img src="/icons/arrow-right.svg" alt="Icon" class="mr-2 ml-4 h-7 w-7" />
				</button>
			</div>
			{#if actionHost}
				<p class="mt-4 text-sm text-neutral-500 sm:w-[80%] dark:text-neutral-400">
					You will be sent to <strong>{actionHost}</strong>
				</p>
			{/if}
			{#if $callingAppType != 'popup'}
				<p class="mt-8 text-neutral-500 sm:w-[80%] dark:text-neutral-400">
					{$callingAppName} is only one of the 100+ applications that have already been built on Nostr,
					<a href="https://nostr.net" target="_blank" class="underline">discover them all</a>!
				</p>
			{/if}
			<p class="mt-6 sm:w-[80%]">
				This is your web profile, you can share it anywhere and with anyone:<br />
				<a href="https://nostr.at/{$npub}" target="_blank" class="break-all underline"
					>nostr.at/{$npub}</a
				>
			</p>
		</div>
	</div>
</BasicLayout>
