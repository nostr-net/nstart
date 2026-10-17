<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { browser } from '$app/env';
	import { onMount, onDestroy } from 'svelte';
	import { theme } from '#lib/store';
	import ThemeSwitcher from '#lib/ThemeSwitcher.svelte';

	let isModal = browser && window.self !== window.top;
	setContext('isModal', isModal);

	let mediaQuery: MediaQueryList | null = null;
	let systemTheme: string | null = null;

	function updateTheme(preferredTheme: string) {
		if (!browser) return;

		const themeToApply =
			preferredTheme === 'system'
				? systemTheme || (mediaQuery?.matches ? 'dark' : 'light')
				: preferredTheme;

		if (themeToApply === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function handleThemeUpdate(event: MessageEvent) {
		// only accept postMessages coming from the parent window (the embedding
		// app), never from other windows/iframes we may embed or open
		if (event.source !== window.parent) return;

		if (event.data && event.data.type === 'THEME_UPDATE') {
			systemTheme = event.data.systemTheme;
			const configuredTheme = event.data.configuredTheme;

			if (configuredTheme === 'system') {
				$theme = systemTheme;
			} else {
				$theme = configuredTheme;
			}
		}

		// the modal embedding sends this when it closes, to make sure the
		// generated secret key does not linger in sessionStorage
		if (event.data && event.data.type === 'CLEAR_SESSION_STORAGE') {
			sessionStorage.clear();
		}
	}

	onMount(() => {
		if (browser) {
			mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			systemTheme = mediaQuery.matches ? 'dark' : 'light';

			// Initialize theme based on URL parameter or system preference
			const params = new URLSearchParams(window.location.search);
			const forcedTheme = params.get('am');

			if (forcedTheme === 'light' || forcedTheme === 'dark') {
				$theme = forcedTheme;
			} else {
				$theme = systemTheme;
			}

			// Listen for theme updates from parent window
			window.addEventListener('message', handleThemeUpdate);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('message', handleThemeUpdate);
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

<slot />
