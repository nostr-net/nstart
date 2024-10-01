<div class="flex sm:flex-row flex-col max-h-max">

	<!-- Intro block -->
	<div class="flex sm:min-h-screen sm:w-[48%] flex-none items-center justify-end bg-gradient-to-tr from-neutral-200 via-neutral-100 to-white p-8 sm:p-0">
		<div class="sm:mr-10 w-full sm:max-w-[350px]">
			<div class="mb-8 border-l-[0.9rem] border-strongpink pl-4 sm:-ml-8">
				<h1 class="font-bold">
					<div class="text-[3em] leading-[1em] text-neutral-500 sm:text-[3em]">PRESENT</div>
					<div class="break-words text-[3.5em] leading-[1em] sm:h-auto sm:text-[3.5em]" id="tw">
						YOURSELF
					</div>
				</h1>
			</div>

			<div class="sm:w-[90%] text-[1.1rem] leading-5 text-neutral-700">
				<p class="mb-6">On Nostr you decide to be whoever you want.</p>
				<p class="mb-6">
					A Nostr profile usually include a name, a picture and some additional information. Every
					data is optional.
				</p>

				<p class="mb-6">
					The name is not a unique username, we can have as many Jacks we want! Feel free to use
					your real name or a nickname; you can change any info whenever you want.<br />
					But remember: online privacy matters, don’t share sensitive data.
				</p>

				<p class="mb-6">
					And yes, to join Nostr you don’t need to give your email, phone number or other data, it
					is KYC free.
				</p>
			</div>
		</div>
	</div>

	<!-- Interactive block -->
	<div class="flex sm:w-[52%] flex-none items-center justify-start bg-white p-8 sm:p-0 mb-10">
		<div class="flex flex-col sm:ml-16 sm:max-w-[350px]">
			<div class="flex mb-6 justify-end items-end">
				<div class="text-xl text-neutral-400 ">Your image</div>
				<div class="h-1 w-20 border-t-2 border-neutral-300 mb-2 ml-2 -mr-8"></div>
				<div class="w-24 h-24 border-2 border-neutral-300 bg-neutral-100 rounded-full ">
					<img src="/icons/pfp.svg" alt="pfp "/>
				</div>
			</div>
			<div>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					placeholder="Your name"
					class="mb-6 rounded border-2 w-full border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
					autofocus
				/>
				<textarea
					placeholder="A brief presentation"
					class="mb-6 rounded border-2 w-full border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				></textarea>
				<input
					type="text"
					placeholder="Your website"
					class="rounded border-2 w-full border-neutral-300 px-4 py-2 text-xl focus:border-neutral-700 focus:outline-none"
				/>
			</div>
			<div class="flex justify-end mt-20">
			<a
				class="inline-flex items-center rounded bg-strongpink px-8 py-2 text-[1.3rem] text-white"
				href="/yourself"
			>
				Continue <img src="/icons/arrow-right.svg" alt="continue" class="ml-4 mr-2 h-5 w-5" />
			</a>
		</div>
		</div>
	</div>
</div>
