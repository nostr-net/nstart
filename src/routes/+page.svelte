<script lang="ts">
	import BasicLayout from '$lib/BasicLayout.svelte';
	const baseUrl = import.meta.env.VITE_BASE_URL;
</script>

<svelte:head>
	<title>Create your Nostr account</title>
	<meta
		name="description"
		content="Create your Nostr account, backup it and get a Nostr Connect bunker URL in few easy steps!"
	/>
	<meta property="og:title" content="Create your Nostr account" />
	<meta
		property="og:description"
		content="Create your Nostr account, backup it and get a Nostr Connect bunker URL in few easy steps!"
	/>
	<meta property="og:image" content="{baseUrl}/images/relay.png" />
</svelte:head>

<div
	class="max-h-max"
	style="background: linear-gradient(to top right, rgba(220, 220, 220, 0.4), rgba(255, 255, 255, 0.9)), url('/bg/noisy.png');"
>
	<div>
		<div class="flex min-h-screen items-center justify-center">
			<div class="mx-auto">
				<!-- content-->
				<div class="p-8 sm:flex sm:flex-row-reverse sm:p-0">
					<div class="flex justify-center sm:relative sm:w-[45vw] sm:overflow-hidden">
						<img
							src="/images/relay.png"
							class="z-0 mb-8 w-60 object-cover sm:absolute sm:-right-[20px] sm:top-10 sm:w-full sm:object-left"
							alt="Nostr Client"
						/>
					</div>

					<div class="z-20 sm:w-[55vw] sm:min-w-[720px] sm:py-10 sm:pl-[16vw]">
						<!-- Welcome title -->
						<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
							<h1 class="font-bold">
								<div class="text-[3rem] leading-[1em] sm:text-[5rem]">WELCOME</div>
								<div
									class="break-words text-[3.5rem] leading-[1em] sm:h-auto sm:text-[6rem]"
									id="tw"
								>
									<span class="text-neutral-500">TO</span>
									<span class="text-strongpink">NOSTR</span>
								</div>
							</h1>
						</div>

						<!-- Intro text -->
						<div class="text-[1.3rem] leading-7 text-neutral-700">
							<p class="">
								To join Nostr you need a profile, but it is not the usual one that a company
								generates and manages for you. You create it yourself, no permissions are required.
							</p>
							<p class="mt-6">
								Nostr is a different experience from the beginning: because there is no central
								authority taking care of who is who, each user is identified by a cryptographic
								keypair; don’t worry about the tech slang, it is just a strong password that you
								will have to keep safe.
							</p>
							<p class="mt-6">
								This wizard is one of the many ways to bootstrap a Nostr profile that you can later
								use in other apps. We help you to create you keypair and safely manage it in a few
								steps. Are you ready?
							</p>
						</div>

						<!-- Start button -->
						<div class="my-8 flex justify-center sm:-mr-20 sm:justify-end">
							<a
								class="inline-flex items-center rounded bg-strongpink px-10 py-4 text-[1.8rem] text-white"
								href="/yourself"
							>
								Let's Start <img
									src="/icons/arrow-right.svg"
									alt="Icon"
									class="ml-4 mr-2 h-7 w-7"
								/>
							</a>
						</div>

						<!-- Footer -->
						<div class="leading-6 text-neutral-500">
							Would you like to know more about Nostr first?<br class="hidden sm:inline-block" />
							<a href="https://njump.me" class="underline">Read a quick introduction</a>
						</div>
					</div>
				</div>
				<!-- /content -->
			</div>
		</div>
	</div>
</div>
