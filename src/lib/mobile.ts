import { writable } from 'svelte/store';

const isMobileStore = writable(false);

const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    console.log("set isMobileStore")
    isMobileStore.set(window.innerWidth <= 768);
    console.log("=", window.innerWidth <= 768)
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

export default isMobileStore;
