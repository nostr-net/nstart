<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sk } from '$lib/store';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';

	onMount(() => {
		if ($sk.length === 0) {
			goto('/');
		}
	});

	function navigateContinue() {
		goto('/finish');
	}
</script>

<TwoColumnLayout>
	<div slot="intro">
		<div class="w-full sm:mr-10 sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[3rem]">FOLLOW</div>
					<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[3.5rem]" id="tw">
						SOMEONE
					</div>
				</h1>
			</div>

			<div class="leading-5 text-neutral-700 sm:w-[90%]">
				<p class="">What do you think now of following some interesting profiles?</p>
				<p class="mt-6">
					When you will use any Nostr application you will automatically find the profiles you
					followed and their content.
				</p>
				<p class="mt-6">
					You can later follow more people, or remove previously selected ones as well; with Nostr
					you control what you want to see, no obscure and deceptive algorithms, no impositions.
				</p>
				<p class="mt-6">
					In some apps you will have also the possibility to create lists, and so organize better
					who you are following.
				</p>
			</div>
		</div>
	</div>

	<div slot="interactive">
		<CheckboxWithLabel position="right" alignment="center">
			<div class="flex items-center border-b-4 border-neutral-200 pb-4 pt-4">
				<img class="inline-block w-8 rounded-full" src="/icons/pfp.svg" alt="pfp" />
				<div class="ml-2 text-xl">Your friend</div>
			</div>
		</CheckboxWithLabel>
		<CheckboxWithLabel position="right" alignment="center">
			<div class="flex items-center border-b-4 border-neutral-200 pb-4 pt-4">
				<img class="inline-block w-8 rounded-full" src="/icons/pfp.svg" alt="pfp" />
				<div class="ml-2 text-xl">My basket team</div>
			</div>
		</CheckboxWithLabel>
		<CheckboxWithLabel position="right" alignment="center">
			<div class="flex items-center border-b-4 border-neutral-200 pb-4 pt-4">
				<img class="inline-block w-8 rounded-full" src="/icons/pfp.svg" alt="pfp" />
				<div class="ml-2 text-xl">Michael Jordan</div>
			</div>
		</CheckboxWithLabel>
		<CheckboxWithLabel position="right" alignment="center">
			<div class="flex items-center border-b-4 border-neutral-200 pb-4 pt-4">
				<img class="inline-block w-8 rounded-full" src="/icons/pfp.svg" alt="pfp" />
				<div class="ml-2 text-xl">Sport group</div>
			</div>
		</CheckboxWithLabel>
		<CheckboxWithLabel position="right" alignment="center">
			<div class="flex items-center border-b-4 border-neutral-200 pb-4 pt-4">
				<img class="inline-block w-8 rounded-full" src="/icons/pfp.svg" alt="pfp" />
				<div class="ml-2 text-xl">Nike</div>
			</div>
		</CheckboxWithLabel>

		<div class="mt-20 flex justify-end">
			<button
				on:click={navigateContinue}
				class="inline-flex items-center rounded bg-strongpink px-8 py-3 text-[1.3rem] text-white"
			>
				Finish <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
			</button>
		</div>
	</div>
</TwoColumnLayout>
