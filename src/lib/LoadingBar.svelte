<script>
	export let progress = 0; // Progress percentage (0-100)
</script>

<div class="relative h-2 w-full rounded bg-gray-200">
	<div
		class="loading-indicator absolute h-full rounded bg-strongpink"
		style="width: {progress}%;"
	></div>
</div>
