<div class="flex max-h-max flex-col sm:flex-row">
	<!-- Intro block -->
	<div
		class="flex flex-none items-center justify-end p-8 sm:min-h-screen sm:w-[48%] sm:p-0"
		style="background: linear-gradient(to top right, rgba(220, 220, 220, 0.5), rgba(255, 255, 255, 0.95)), url('/bg/noisy.png');"
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
