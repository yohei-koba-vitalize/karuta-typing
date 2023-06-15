import { writable } from 'svelte/store';

export const isLogin = writable(false);
export const gameStatus = writable("START");
export const name = writable("");
export const result = writable(0);
export const subResult = writable(0);
export const playTimeText = writable("");
