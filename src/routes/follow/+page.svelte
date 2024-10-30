<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sk } from '$lib/store';
	import TwoColumnLayout from '$lib/TwoColumnLayout.svelte';
	import CheckboxWithLabel from '$lib/CheckboxWithLabel.svelte';
	import { finalizeEvent, type EventTemplate } from 'nostr-tools/pure';
	import { pool, indexRelays } from '$lib/nostr';
	import { SimplePool } from 'nostr-tools/pool';

	const FOLLOWS = [
		{
			name: 'daniele',
			pubKey: '7d7ab7a90fbc8e4f0f3689f0fa696451bc85d2d41f9f1f532c116f00001a5f54',
			image: 'https://avatars.githubusercontent.com/u/89577423'
		},
		{
			name: 'fiatjaf',
			pubKey: '54823f12df08849c934ee40e474445f1c48ece76f9b4794f2adf7102baba3fba',
			image: 'https://fiatjaf.com/static/favicon.jpg'
		},
		{
			name: 'hodlbod',
			pubKey: '97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322',
			image: 'https://i.nostr.build/AZ0L.jpg'
		},
		{
			name: 'Michael Dilger',
			pubKey: 'ee11a5dff40c19a555f41fe42b48f00e618c91225622ae37b6c2bb67b76c4e49',
			image: 'https://mikedilger.com/bs.webp'
		},
		{
			name: 'Snowden',
			pubKey: '86c23ef6610e4e639868d2f36527eed585a861afcc49cae8955ff8c1dbe31723',
			image: 'https://nostr.build/i/p/6838p.jpeg'
		},
		{
			name: 'jack',
			pubKey: '7d7ab7a90fbc8e4f0f3689f0fa696451bc85d2d41f9f1f532c116f00001a5f54',
			image:
				'https://image.nostr.build/26867ce34e4b11f0a1d083114919a9f4eca699f3b007454c396ef48c43628315.jpg'
		}
	];

	let randomUsers: any[] = [];
	let selectedUsers = new Set();

	onMount(() => {
		if ($sk.length === 0) {
			goto('/');
		}
		pickRandomUsers();
	});

	function pickRandomUsers() {
		const shuffled = FOLLOWS.sort(() => 0.5 - Math.random());
		randomUsers = shuffled.slice(0, 5);
	}

	function toggleUserSelection(user: { pubKey: unknown }) {
		if (selectedUsers.has(user.pubKey)) {
			selectedUsers.delete(user.pubKey);
		} else {
			selectedUsers.add(user.pubKey);
		}
	}

	async function getSelectedUsersArray() {
		const ids = [];
		const result = [];

		for (const user of FOLLOWS) {
			if (selectedUsers.has(user.pubKey)) {
				const userArray = ['p', user.pubKey, '', user.name];
				ids.push(user.pubKey);
				result.push(userArray);
			}
		}

		const pool = new SimplePool();
		let events = await pool.querySync(['wss://purplepag.es'], { kinds: [3], authors: ids });
		events.forEach((e) => {
			e.tags.forEach((tag) => {
				result.push(tag);
			});
		});
		return result;
	}

	async function publishFollow() {
		let contacts = await getSelectedUsersArray();
		let eventTemplate: EventTemplate = {
			kind: 3,
			created_at: Math.floor(Date.now() / 1000),
			tags: contacts,
			content: ''
		};
		let signedEvent = finalizeEvent(eventTemplate, $sk);
		pool.publish(indexRelays, signedEvent);
	}

	function navigateContinue() {
		publishFollow();
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
				<p class="">What do you think now of following some interesting profiles? We offer you the possibility to copy the full following list of some Nostr users!</p>
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
		<div class="sm:mt-20">
			<!-- list of follows -->
			<div>
				See the same things these Nostr users are seeing in their feed:
			</div>
			<div class="mt-4">
			{#each randomUsers as user}
				<CheckboxWithLabel
					checked={selectedUsers.has(user.pubKey)}
					onClick={() => toggleUserSelection(user)}
					position="right"
					alignment="center"
				>
					<div class="flex items-center border-b-4 border-neutral-200 pb-4 pt-4">
						<div
							class="inline-block h-8 w-8 rounded-full bg-cover bg-center"
							style="background-image: url('{user.image}');"
						></div>
						<div class="ml-2 text-xl">{user.name}</div>
					</div>
				</CheckboxWithLabel>
			{/each}
		</div>
		</div>

		<div class="mt-10 flex justify-end">
			<button
				on:click={navigateContinue}
				class="inline-flex items-center rounded bg-strongpink px-8 py-3 text-[1.3rem] text-white"
			>
				Finish <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
			</button>
		</div>
	</div>
</TwoColumnLayout>
