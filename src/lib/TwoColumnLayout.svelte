<div class="flex max-h-max flex-col sm:flex-row dark:bg-neutral-800">
	<!-- Intro block -->
	<div
		class="gradient flex flex-none items-center justify-end p-8 sm:min-h-screen sm:w-[48%] sm:p-0 "
		style="background: linear-gradient(to top right, rgba(220, 220, 220, 0.5), rgba(255, 255, 255, 0.95)), url('/bg/noisy.png');"
	>
		<div class="animate-fade1">
			<slot name="intro" />
		</div>
	</div>

	<!-- Interactive block -->
	<div
		class="mb-10 flex flex-none animate-fade2 items-center sm:min-h-screen justify-start bg-white dark:bg-neutral-800 p-8 sm:w-[52%] sm:p-0"
	>
		<div class="flex w-full max-w-full animate-fade2 flex-col sm:ml-16 sm:max-w-[350px]">
			<slot name="interactive" />
		</div>
	</div>
</div>
