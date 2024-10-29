import { writable } from 'svelte/store';

export const sk = writable(new Uint8Array());
export const pk = writable('');
export const npub = writable('');

export const name = writable('');
export const backupPrivKey = writable('');
export const password = writable('');
export const ncryptOption = writable(false);