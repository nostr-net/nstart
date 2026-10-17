<script lang="ts">
	import { onMount } from 'svelte';
	import {
		accent,
		followerSuggestions,
		callingAppName,
		callingAppType,
		callingAppCode,
		skipBunker,
		forceBunker,
		avoidNsec,
		avoidNcryptsec,
		readRelays,
		writeRelays,
		skipFollow
	} from '$lib/store';
	import { getContext } from 'svelte';
	import { theme } from '$lib/store';
	import { SITE_NAME, SITE_URL } from '$lib/seo';

	const isModal = getContext('isModal');

	const pageTitle = 'Nostr — Get Started: Create Your Free Nostr Account';
	const pageDescription =
		"New to Nostr? It's an open, decentralized social network that no company controls. Create your free Nostr account, back up your keys and log in to any Nostr app.";
	const ogImage = `${SITE_URL}/images/relay.png`;
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: pageTitle,
		description: pageDescription,
		url: `${SITE_URL}/`,
		inLanguage: 'en',
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: SITE_URL
		}
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		// Set the accent color, if present, otherwise use the store default
		const accent = params.get('aa');
		if (accent) {
			$accent = accent;
		}
		document.documentElement.style.setProperty('--accent-color', '#' + $accent);

		// Set forced theme if specified
		const forcedTheme = params.get('am');
		if (forcedTheme === 'light' || forcedTheme === 'dark') {
			console.log('forcedTheme =>', forcedTheme);
			$theme = forcedTheme;
		}

		// Manage suggested profiles
		const followerSuggestions = params.get('s');
		$followerSuggestions = followerSuggestions ? followerSuggestions.split(',') : [];

		// Manage return back auto-login
		const callingAppName = params.get('an');
		$callingAppName = callingAppName;
		const callingAppType = params.get('at');
		$callingAppType = callingAppType;
		const callingAppCode = params.get('ac');
		$callingAppCode = callingAppCode;

		// If a param is missing, reset all
		if (!$callingAppName || !$callingAppType || !$callingAppCode) {
			$callingAppName = '';
			$callingAppType = '';
			$callingAppCode = '';
		}

		// Manage asb param to skip Bunker step
		const skipBunker = params.get('asb');
		if (skipBunker == 'yes') {
			$skipBunker = true;
		}

		// Manage afb param to skip Bunker step
		const forceBunker = params.get('afb');
		if (forceBunker == 'yes') {
			$forceBunker = true;
		}

		// Manage aan to avoid returning Nsec
		const avoidNsec = params.get('aan');
		if (avoidNsec == 'yes') {
			$avoidNsec = true;
		}

		// Manage aac to avoid returning Ncryptsec
		const avoidNcryptsec = params.get('aac');
		if (avoidNcryptsec == 'yes') {
			$avoidNcryptsec = true;
		}

		// Manage custom relays
		const readRelays = params.get('awr');
		$readRelays = readRelays ? readRelays.split(',') : [];
		const writeRelays = params.get('arr');
		$writeRelays = writeRelays ? writeRelays.split(',') : [];

		// Manage aaf to skip following
		const skipFollow = params.get('asf');
		if (skipFollow == 'yes') {
			$skipFollow = true;
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href="{SITE_URL}/" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:url" content="{SITE_URL}/" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={ogImage} />
	<meta
		property="og:image:alt"
		content="Illustration of Nostr relays transmitting signed notes between users"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={ogImage} />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<div class="dark:bg-neutral-800">
	<div
		class="gradient max-h-max bg-white"
		style="background: linear-gradient(to top right, rgba(220, 220, 220, 0.4), rgba(255, 255, 255, 0.9)), url('/bg/noisy.png');"
	>
		<div>
			<div class="flex min-h-screen items-center justify-center">
				<div class="mx-auto py-8 sm:pt-0">
					<!-- content-->
					<div class="px-8 sm:flex sm:flex-row-reverse sm:items-center sm:p-0">
						<div
							class="flex animate-fade2down justify-center sm:relative sm:h-screen sm:basis-[45vw] sm:overflow-hidden"
						>
							{#if !isModal}
								<img
									src={`/images/${$theme === 'dark' ? 'dark-relay' : 'relay'}.png`}
									class="z-0 mb-8 w-60 sm:absolute sm:-right-[20px] sm:top-[15%] sm:w-full sm:object-left"
									alt="Nostr Client"
								/>
							{/if}
						</div>

						<div class="z-20 basis-[55%] sm:py-10 sm:pl-[16vw]">
							<!-- Welcome title -->
							<div
								class="mb-8 animate-fade2 border-l-[0.9rem] border-accent pl-4 opacity-0 sm:-ml-8"
								style="animation-delay: 0.2s;"
							>
								<h1 class="font-bold">
									<div class="text-[3rem] leading-[1em] text-black dark:text-white sm:text-[5rem]">
										WELCOME
									</div>
									<div
										class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[6rem]"
										id="tw"
									>
										<span class="text-neutral-500 dark:text-neutral-400">TO</span>
										<span class="text-accent">NOSTR</span>
									</div>
								</h1>
							</div>

							<!-- Intro text -->
							<div
								class="animate-fade1 text-[1.3rem] leading-7 text-neutral-700 opacity-0 dark:text-neutral-100"
								style="animation-delay: 0.5s;"
							>
								<p class="">
									To join Nostr you need a profile, but it is not the usual one that a company
									generates and manages for you. You create it yourself, no permissions are
									required.
								</p>
								<p class="mt-6">
									Nostr is a different experience from the beginning: because there is no central
									authority taking care of who is who, each user is identified by a cryptographic
									keypair; don't worry about the tech slang, it is just a strong password that you
									will have to keep safe.
								</p>
								<p class="mt-6">
									{#if $callingAppName}
										This wizard is used by <strong>{$callingAppName}</strong> to let you create your
										new profile and safely manage it, in a few steps.
									{:else}
										This wizard is one of the many ways to bootstrap a Nostr profile that you can
										later use in other apps. We help you to create your keypair and safely manage it
										in a few steps. Are you ready?
									{/if}
								</p>
							</div>

							<!-- Start button -->
							<div
								class="my-8 flex animate-fade1 justify-center opacity-0 sm:-mr-20 sm:justify-end"
								style="animation-delay: 0.7s;"
							>
								<a
									class="inline-flex items-center rounded bg-accent px-10 py-4 text-[1.8rem] text-white"
									href="/yourself"
								>
									Let's Start <img
										src="/icons/arrow-right.svg"
										alt="Icon"
										class="ml-4 mr-2 h-7 w-7"
									/>
								</a>
							</div>

							{#if !isModal}
								<!-- Footer -->
								<div
									class="animate-fade1 leading-6 text-neutral-500 opacity-0 dark:text-neutral-300"
									style="animation-delay: 1s;"
								>
									Would you like to know more about Nostr first?<br
										class="hidden sm:inline-block"
									/>
									<a href="https://njump.me" class="underline">Read a quick introduction</a>
								</div>

								<!-- Search-engine-visible explainer -->
								<section
									aria-labelledby="what-is-nostr"
									class="mt-8 animate-fade1 text-base leading-6 text-neutral-600 opacity-0 dark:text-neutral-300"
									style="animation-delay: 1.1s;"
								>
									<h2 id="what-is-nostr" class="font-bold text-neutral-800 dark:text-neutral-100">
										What is Nostr?
									</h2>
									<p class="mt-2">
										Nostr ("Notes and Other Stuff Transmitted by Relays") is an open protocol for
										decentralized social media and messaging. There is no company in the middle:
										your identity is a cryptographic key pair that you own, your posts are signed
										with it and shared through independent relays, and you can use the same account
										in many different Nostr apps.
									</p>
									<p class="mt-2">
										This page helps you get started on Nostr: it creates your key pair and profile
										in your browser, helps you back up your secret key, and lets you follow a few
										people so you can log in to any Nostr app right away.
									</p>
								</section>
							{/if}
						</div>
					</div>
					<div
						class="mt-10 animate-fade1 text-center text-sm text-neutral-400 opacity-0 dark:text-neutral-500 sm:mt-4"
						style="animation-delay: 1.2s;"
					>
						The source code for this service is <a
							href="https://github.com/dtonon/nstart"
							target="_blank"
							class="underline">free and open</a
						>
					</div>
					<!-- /content -->
				</div>
			</div>
		</div>
	</div>
</div>
