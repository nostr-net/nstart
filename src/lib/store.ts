import { writable } from 'svelte/store';

export const name = writable('');
export const npub = writable('');
export const backupPrivKey = writable('');
export const password = writable('');
export const ncryptOption = writable(false);