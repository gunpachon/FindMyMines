import type { Game } from "./types";

export const setupState = $state({
  name: "",
});

export const gameState = $state<{ state: Game | undefined; myIndex: number | undefined }>({
  state: undefined,
  myIndex: undefined,
});
