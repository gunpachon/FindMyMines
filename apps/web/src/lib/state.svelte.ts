import type { Game } from "./types";

export const setupState = $state({
  name: "",
});

export const gameState = $state<{ state: Game | undefined }>({
  state: undefined,
});
