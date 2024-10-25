<div class="flex max-h-max flex-col sm:flex-row">
	<!-- Intro block -->
	<div
		class="flex flex-none items-center justify-end bg-gradient-to-tr from-neutral-200 via-neutral-100 to-white p-8 sm:min-h-screen sm:w-[48%] sm:p-0"
	>
		<slot name="intro" />
	</div>

	<!-- Interactive block -->
	<div class="mb-10 flex flex-none items-center justify-start bg-white p-8 sm:w-[52%] sm:p-0">
		<div class="flex w-full max-w-full flex-col sm:ml-16 sm:max-w-[350px]">
			<slot name="interactive" />
		</div>
	</div>
</div>
