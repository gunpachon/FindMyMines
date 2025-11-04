<script lang="ts">
  import { io } from "socket.io-client";
  import { browser } from "$app/environment";
  import { socketContext } from "$lib/context";
  import { setupState, gameState } from "$lib/state.svelte";
  import type { Game } from "$lib/types";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";

  let { children } = $props();

  function gotoIfNotAt(route: string) {
    if (page.route.id !== route) {
      goto(route, {
        replaceState: page.route.id !== "/(game)",
      });
    }
  }

  if (browser) {
    if (!gameState.state) {
      gotoIfNotAt("/");
    }

    const socket = io(env.PUBLIC_BACKEND_HOST ?? ":3000");

    socketContext.set(socket);

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("created", (code) => {
      const avatarValue = setupState.avatar !== undefined ? String(setupState.avatar) : "0";
      socket.emit("join", setupState.name, code, avatarValue);
    });

    socket.on("gameState", (state: Game) => {
      gameState.state = state;
      gameState.myIndex = gameState.state.players.findIndex(
        (player) => player.socketID === socket.id,
      );

      if (gameState.myIndex === -1) {
        gameState.myIndex = undefined;
      }

      if (state.status === "waiting") {
        gotoIfNotAt("/waiting");
      } else {
        gotoIfNotAt("/game");
      }
    });

    socket.on("reset", () => {
      gameState.state = undefined;
      goto("/", { replaceState: true });
    });
  }
</script>

{@render children?.()}
