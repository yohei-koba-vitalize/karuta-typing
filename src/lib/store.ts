import { Writable, writable } from "svelte/store";

export type GameStatus = "START" | "PLAYING" | "RESULT" | "RANKING";
export type Result = {
  name: string;
  result: number;
  sub_result: number;
  created_at: Date;
};

export const isLogin = writable(false);
export const gameStatus: Writable<GameStatus> = writable("START");
export const name = writable("");
export const result = writable(0);
export const subResult = writable(0);
export const playTimeText = writable("");
export const editingData: Writable<Result | null> = writable(null);
