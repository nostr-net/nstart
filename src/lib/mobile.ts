import { writable } from 'svelte/store';

export const isMobile = writable(false);

const updateIsMobile = () => {
	if (typeof window !== 'undefined') {
		console.log('set isMobile', window.innerWidth <= 768);
		isMobile.set(window.innerWidth <= 768);
	}
};

if (typeof window !== 'undefined') {
	window.addEventListener('resize', updateIsMobile);
	updateIsMobile();
}

export const cleanup = () => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('resize', updateIsMobile);
	}
};
