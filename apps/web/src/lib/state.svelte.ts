import type { Game } from "./types";

export const setupState = $state<{ name: string; avatar: number | undefined }>({
  name: "",
  avatar: undefined,
});

export const gameState = $state<{ state: Game | undefined; myIndex: number | undefined }>({
  state: undefined,
  myIndex: undefined,
});
