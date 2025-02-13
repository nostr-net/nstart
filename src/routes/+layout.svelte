<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { theme } from '$lib/store';
	import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';

	// Check if we're in iframe mode
	let isModal = browser && window.self !== window.top;
	setContext('isModal', isModal);

	if (browser) {
		window.addEventListener('message', (event) => {
			if (event.data.type === 'CLEAR_SESSION_STORAGE') {
				sessionStorage.clear();
			}
		});
	}

	let mediaQuery: MediaQueryList | null = null;

	function updateTheme(preferredTheme: string) {
		if (!browser) return;
		
		if (preferredTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function systemThemeChanged(e: MediaQueryListEvent) {
		// Only update if theme matches system (is not locked)
		const systemTheme = e.matches ? 'dark' : 'light';
		if ($theme === systemTheme) {
			updateTheme(systemTheme);
		}
	}

	onMount(() => {
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', systemThemeChanged);
		
		// Set initial theme
		updateTheme($theme);
	});

	onDestroy(() => {
		if (mediaQuery) {
			mediaQuery.removeEventListener('change', systemThemeChanged);
		}
	});

	// Subscribe to theme changes
	$: updateTheme($theme);
</script>

{#if !isModal}
	<div class="fixed top-4 right-4 z-50">
		<ThemeSwitcher />
	</div>
{/if}

{#if isModal}
	<slot />
{:else}
	<slot />
{/if}
