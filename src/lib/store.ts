import { writable } from 'svelte/store';

// Utility function to handle sessionStorage
function createSessionWritable(key, initialValue) {
    const isBrowser = typeof window !== 'undefined';

    const storedValue = isBrowser ? sessionStorage.getItem(key) : null;
    const data = storedValue ? storedValue : initialValue;

    const store = writable(data);

    if (isBrowser) {
        store.subscribe(value => {
            sessionStorage.setItem(key, value);
        });
    }

    return store;
}

// Create your stores with session persistence
export const sk = createSessionWritable('sk', new Uint8Array());
export const pk = createSessionWritable('pk', '');
export const npub = createSessionWritable('npub', '');

export const name = createSessionWritable('name', '');
export const picture = createSessionWritable('picture', '');
export const about = createSessionWritable('about', '');
export const website = createSessionWritable('website', '');

export const backupPrivKey = createSessionWritable('backupPrivKey', '');
export const password = createSessionWritable('password', '');
export const ncryptOption = createSessionWritable('ncryptOption', false);
