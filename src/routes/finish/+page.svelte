<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sk } from '$lib/store';
	import BasicLayout from '$lib/BasicLayout.svelte';
	import { name, npub } from '$lib/store';

	onMount(() => {
		if ($sk.length === 0) {
			goto('/');
		}
	});
</script>

<BasicLayout>
	<div slot="content">
		<!-- Welcome title -->
		<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
			<h1 class="font-bold">
				<div class="text-[3rem] leading-[1em] text-neutral-500 sm:text-[6rem]">EXPLORE</div>
				<div class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[7rem]" id="tw">
					NOSTR
				</div>
			</h1>
		</div>

		<!-- Intro text -->
		<div class="text-neutral-700 sm:w-[80%]">
			<p class="text-xl">
				We have finished, <strong>{$name}</strong>! Now you can start exploring Nostr, using a web
				applications or downloading an app. These are some suggestions for getting started
				immediately:
			</p>
			<div class="mt-8 grid grid-cols-2 gap-x-12 gap-y-6 sm:flex sm:flex-row sm:gap-12">
				<div class="flex w-24 flex-col justify-self-center">
					<div class="h-24 w-24 rounded-full border-8 border-strongpink bg-white"></div>
					<div class="mt-2 text-center">Coracle</div>
					<div class="mt-2 text-center text-sm text-neutral-500">Social network</div>
				</div>
				<div class="flex w-24 flex-col justify-self-center">
					<div class="h-24 w-24 rounded-full border-8 border-strongpink bg-white"></div>
					<div class="mt-2 text-center">Wikistr</div>
					<div class="mt-2 text-center text-sm text-neutral-500">Free encyclopedia</div>
				</div>
				<div class="flex w-24 flex-col justify-self-center">
					<div class="h-24 w-24 rounded-full border-8 border-strongpink bg-white"></div>
					<div class="mt-2 text-center">Habla.news</div>
					<div class="mt-2 text-center text-sm text-neutral-500">Blogging platform</div>
				</div>
				<div class="flex w-24 flex-col justify-self-center">
					<div class="h-24 w-24 rounded-full border-8 border-strongpink bg-white"></div>
					<div class="mt-2 text-center">Zap.stream</div>
					<div class="mt-2 text-center text-sm text-neutral-500">Streaming platform</div>
				</div>
			</div>
			<p class="mt-8 text-neutral-500">
				This is only a quick selection of the 80+ applications that have already been built on
				Nostr, <a href="https://nostrapps.com" class="underline">discover them all</a>!
			</p>
			<p class="mt-6">
				This is your web profile, you can share it anywhere and with anyone:<br />
				<a href="https://njump.me/{$npub}" class="break-all underline">njump.me/{$npub}</a>
			</p>
		</div>
	</div>
</BasicLayout>
