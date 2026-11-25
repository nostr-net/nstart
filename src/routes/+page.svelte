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
	} from '#lib/store';
	import { get } from 'svelte/store';
	import { validateCallingAppParams } from '#lib/callingApp';
	import { getContext } from 'svelte';
	import { theme } from '#lib/store';
	import { SITE_NAME, SITE_URL } from '#lib/seo';

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

		// Set the accent color, if present and a valid hex color, otherwise use the store default
		const accentParam = params.get('aa');
		if (accentParam && /^[0-9a-fA-F]{3,8}$/.test(accentParam)) {
			accent.set(accentParam);
		}
		document.documentElement.style.setProperty('--accent-color', '#' + get(accent));

		// Set forced theme if specified
		const forcedTheme = params.get('am');
		if (forcedTheme === 'light' || forcedTheme === 'dark') {
			theme.set(forcedTheme);
		}

		// Manage suggested profiles
		const suggestions = params.get('s');
		followerSuggestions.set(suggestions ? suggestions.split(',') : []);

		// Manage return back auto-login: only trust params that pass validation,
		// otherwise reset all three
		const callingApp = validateCallingAppParams(
			params.get('an'),
			params.get('at'),
			params.get('ac')
		);
		if (callingApp) {
			callingAppName.set(callingApp.name);
			callingAppType.set(callingApp.type);
			callingAppCode.set(callingApp.code);
		} else {
			callingAppName.set('');
			callingAppType.set('');
			callingAppCode.set('');
		}

		// Manage asb param to skip Bunker step
		if (params.get('asb') == 'yes') {
			skipBunker.set(true);
		}

		// Manage afb param to skip Bunker step
		if (params.get('afb') == 'yes') {
			forceBunker.set(true);
		}

		// Manage aan to avoid returning Nsec
		if (params.get('aan') == 'yes') {
			avoidNsec.set(true);
		}

		// Manage aac to avoid returning Ncryptsec
		if (params.get('aac') == 'yes') {
			avoidNcryptsec.set(true);
		}

		// Manage custom relays
		const readRelaysParam = params.get('awr');
		readRelays.set(readRelaysParam ? readRelaysParam.split(',') : []);
		const writeRelaysParam = params.get('arr');
		writeRelays.set(writeRelaysParam ? writeRelaysParam.split(',') : []);

		// Manage asf to skip following
		if (params.get('asf') == 'yes') {
			skipFollow.set(true);
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
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: content is JSON.stringify'd with `<` escaped as \u003c -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\u003c')}</` +
		`script>`}
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
							class="animate-fade2down flex justify-center sm:relative sm:h-screen sm:basis-[45vw] sm:overflow-hidden"
						>
							{#if !isModal}
								<img
									src={`/images/${$theme === 'dark' ? 'dark-relay' : 'relay'}.png`}
									class="z-0 mb-8 w-60 sm:absolute sm:top-[15%] sm:-right-[20px] sm:w-full sm:object-left"
									alt="Nostr Client"
								/>
							{/if}
						</div>

						<div class="z-20 basis-[55%] sm:py-10 sm:pl-[16vw]">
							<!-- Welcome title -->
							<div
								class="animate-fade2 border-accent mb-8 border-l-[0.9rem] pl-4 opacity-0 sm:-ml-8"
								style="animation-delay: 0.2s;"
							>
								<h1 class="font-bold">
									<div class="text-[3rem] leading-[1em] text-black sm:text-[5rem] dark:text-white">
										WELCOME
									</div>
									<div
										class="text-[3.5rem] leading-[1em] break-words sm:h-auto sm:text-[6rem]"
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
										This wizard is used by <strong>{$callingAppName}</strong> to let you create your new
										profile and safely manage it, in a few steps.
									{:else}
										This wizard is one of the many ways to bootstrap a Nostr profile that you can
										later use in other apps. We help you to create your keypair and safely manage it
										in a few steps. Are you ready?
									{/if}
								</p>
							</div>

							<!-- Start button -->
							<div
								class="animate-fade1 my-8 flex justify-center opacity-0 sm:-mr-20 sm:justify-end"
								style="animation-delay: 0.7s;"
							>
								<a
									class="bg-accent inline-flex items-center rounded px-10 py-4 text-[1.8rem] text-white"
									href="/yourself"
								>
									Let's Start <img
										src="/icons/arrow-right.svg"
										alt="Icon"
										class="mr-2 ml-4 h-7 w-7"
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
									class="animate-fade1 mt-8 text-base leading-6 text-neutral-600 opacity-0 dark:text-neutral-300"
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
						class="animate-fade1 mt-10 text-center text-sm text-neutral-400 opacity-0 sm:mt-4 dark:text-neutral-500"
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
