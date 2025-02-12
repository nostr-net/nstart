<script lang="ts">
	export let checked = false;
	export let disabled = false;
	export let id = `checkbox-${Math.random().toString(36).slice(2, 11)}`;
	export let position = 'left';
	export let alignment = 'start';
	export let onClick: (() => void) | undefined = undefined;
</script>

<div>
	<label
		for={id}
		class="flex w-full cursor-pointer {position === 'right'
			? 'justify-between'
			: ''} items-{alignment} {position === 'right' ? 'flex-row-reverse' : 'flex-row'}"
	>
		<span
			class={`custom-focus mr-2 inline-block h-6 w-6 flex-none rounded border-2 focus-within:ring-1 ${checked ? 'border-accent bg-accent' : 'enabled:input-hover-enabled border-neutral-300'}`}
		>
			<input
				type="checkbox"
				{id}
				class="absolute h-0 w-0 opacity-0"
				on:click={() => {
					checked = !checked;
					if (onClick) onClick();
				}}
				{disabled}
				bind:checked
			/>
			{#if checked}
				<svg
					class="h-[19px] w-[18px] text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="4"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{/if}
		</span>
		<div>
			<slot></slot>
			<!-- Slot for the text -->
		</div>
	</label>
</div>
